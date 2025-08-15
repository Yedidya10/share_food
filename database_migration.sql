-- Database Migration Script for ShareFood Platform
-- Generated on: August 15, 2025
-- Description: Complete database schema migration including tables, views, functions, and RLS policies

-- =============================================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =============================================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================================================
-- 2. CREATE ENUMS
-- =============================================================================

-- Item status enum
CREATE TYPE item_status AS ENUM ('draft', 'published', 'expired', 'taken');

-- Message type enum
CREATE TYPE message_type AS ENUM ('user', 'system');

-- =============================================================================
-- 3. CREATE CORE TABLES
-- =============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    is_have_whatsapp BOOLEAN DEFAULT false,
    email TEXT,
    main_address JSONB,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    
    -- Location fields
    street_name TEXT NOT NULL,
    street_number TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    country TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    
    -- Contact information
    phone_number TEXT,
    is_have_whatsapp BOOLEAN DEFAULT false,
    email TEXT,
    
    -- Status and lifecycle
    status item_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    expire_interval INTERVAL DEFAULT '7 days',
    explicit_expire_at TIMESTAMPTZ,
    
    -- User reference
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ,
    status_updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Conversations table for chat functionality
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure unique conversation per item-requester pair
    UNIQUE(item_id, requester_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type message_type DEFAULT 'user',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 4. CREATE INDEXES
-- =============================================================================

-- Performance indexes for items
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_items_published_at ON items(published_at);
CREATE INDEX IF NOT EXISTS idx_items_deleted_at ON items(deleted_at);

-- Spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_items_location ON items USING GIST(location);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_items_status_deleted_at ON items(status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_items_user_status ON items(user_id, status);

-- Indexes for conversations and messages
CREATE INDEX IF NOT EXISTS idx_conversations_item_id ON conversations(item_id);
CREATE INDEX IF NOT EXISTS idx_conversations_requester_id ON conversations(requester_id);
CREATE INDEX IF NOT EXISTS idx_conversations_owner_id ON conversations(owner_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- =============================================================================
-- 5. CREATE VIEWS
-- =============================================================================

-- Active items view (non-deleted items)
CREATE OR REPLACE VIEW active_items AS
SELECT
    id,
    title,
    description,
    category,
    images,
    street_name,
    street_number,
    city,
    postal_code,
    country,
    location,
    phone_number,
    is_have_whatsapp,
    email,
    status,
    published_at,
    expire_interval,
    explicit_expire_at,
    user_id,
    created_at,
    updated_at,
    status_updated_at,
    deleted_at,
    -- Join with profile for user details
    (SELECT first_name || ' ' || last_name FROM profiles WHERE profiles.id = items.user_id) as full_name
FROM items
WHERE deleted_at IS NULL;

-- =============================================================================
-- 6. CREATE FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update location from address components
CREATE OR REPLACE FUNCTION update_location_from_address()
RETURNS TRIGGER AS $$
BEGIN
    -- This is a simplified version - in production you'd use a geocoding service
    -- For now, we'll just set a default location based on city
    IF NEW.city IS NOT NULL THEN
        -- Set a default location (Tel Aviv coordinates as example)
        NEW.location = ST_GeogFromText('POINT(34.7818 32.0853)');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get items nearby with filtering
CREATE OR REPLACE FUNCTION get_items_nearby(
    user_lat DOUBLE PRECISION DEFAULT NULL,
    user_lng DOUBLE PRECISION DEFAULT NULL,
    sort_by TEXT DEFAULT 'date',
    category_filter TEXT[] DEFAULT NULL,
    status_filter TEXT[] DEFAULT NULL,
    search_term TEXT DEFAULT NULL,
    max_distance_km DOUBLE PRECISION DEFAULT NULL,
    from_date TIMESTAMP DEFAULT NULL,
    to_date TIMESTAMP DEFAULT NULL,
    include_user_id UUID DEFAULT NULL,
    exclude_user_id UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS SETOF active_items AS $$
DECLARE
    user_location GEOGRAPHY;
BEGIN
    -- Create user location point if coordinates provided
    IF user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
        user_location := ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')');
    END IF;

    RETURN QUERY
    SELECT ai.*
    FROM active_items ai
    WHERE 
        -- Status filter
        (status_filter IS NULL OR ai.status = ANY(status_filter))
        
        -- Category filter
        AND (category_filter IS NULL OR ai.category = ANY(category_filter))
        
        -- Search filter
        AND (search_term IS NULL OR 
             ai.title ILIKE '%' || search_term || '%' OR 
             ai.description ILIKE '%' || search_term || '%')
        
        -- Date range filter
        AND (from_date IS NULL OR ai.created_at >= from_date)
        AND (to_date IS NULL OR ai.created_at <= to_date)
        
        -- User filters
        AND (include_user_id IS NULL OR ai.user_id = include_user_id)
        AND (exclude_user_id IS NULL OR ai.user_id != exclude_user_id)
        
        -- Distance filter
        AND (max_distance_km IS NULL OR user_location IS NULL OR 
             ST_DWithin(ai.location, user_location, max_distance_km * 1000))
    
    ORDER BY 
        CASE 
            WHEN sort_by = 'distance' AND user_location IS NOT NULL THEN 
                ST_Distance(ai.location, user_location)
            ELSE NULL
        END ASC,
        CASE 
            WHEN sort_by = 'date' THEN ai.created_at
            ELSE NULL
        END DESC
    
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. CREATE TRIGGERS
-- =============================================================================

-- Update updated_at on profiles
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on items
CREATE TRIGGER trigger_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update location when address changes
CREATE TRIGGER trigger_items_update_location
    BEFORE INSERT OR UPDATE OF street_name, street_number, city, country ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_address();

-- Update updated_at on conversations
CREATE TRIGGER trigger_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Items policies
CREATE POLICY "Anyone can view published items" ON items
    FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Users can view their own items" ON items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items" ON items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" ON items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" ON items
    FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view conversations they participate in" ON conversations
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create conversations for items" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.requester_id = auth.uid() OR conversations.owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.requester_id = auth.uid() OR conversations.owner_id = auth.uid())
        )
    );

-- =============================================================================
-- 9. STORAGE POLICIES (for images)
-- =============================================================================

-- Storage bucket for item images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('share-food-images', 'share-food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'share-food-images' AND
        auth.role() = 'authenticated'
    );

-- Allow public read access to images
CREATE POLICY "Images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'share-food-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'share-food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =============================================================================
-- 10. SAMPLE DATA (OPTIONAL)
-- =============================================================================

-- Insert sample categories (you can modify these as needed)
-- Note: This assumes you have a categories table, adjust as needed

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Don't forget to:
-- 1. Update your environment variables
-- 2. Run `supabase db reset` if this is a fresh setup
-- 3. Run `npm run gen-types` to update TypeScript types
-- 4. Test all RLS policies
-- 5. Configure real-time subscriptions if needed

COMMENT ON SCHEMA public IS 'ShareFood Platform Database Schema - Generated August 15, 2025';
