export type Item = {
  user_id: string;
  id: string;
  title: string;
  description: string;
  images: string[];
  full_name: string;
  street_name: string;
  street_number: string;
  city: string;
  postal_code?: string;
  country: string;
  phone_number?: string;
  is_have_whatsapp: boolean;
  email?: string;
  status: "pending" | "published" | "draft" | "delivered" | "edited";
  created_at: string;
};