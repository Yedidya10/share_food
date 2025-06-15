type ItemBaseFormValues = {
  title: string;
  description: string;
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  postalCode: string;
  contactViaSite: boolean;
  contactByPhone: boolean;
  contactByEmail: boolean;
  phoneNumber?: string | null;
  isHaveWhatsApp?: boolean;
  email?: string | null;
};

export type InitialValues = {
  title: string;
  description: string;
  images: string[];
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  postalCode?: string;
  contactByPhone: boolean;
  contactByEmail: boolean;
  phoneNumber?: string | null;
  isHaveWhatsApp: boolean;
  email?: string;
};

export type dBitem = {
  id: string;
  full_name: string | null;
  title: string;
  description: string;
  images: string[];
  street_name: string;
  street_number: string;
  city: string;
  postal_code: string;
  country: string;
  phone_number: string | null;
  is_have_whatsapp: boolean;
  email: string;
  status: "published" | "pending" | "draft" | "delivered" | "edited";
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// Extend the default form values with images
export type PostItemFormValues = ItemBaseFormValues & {
  images: File[];
};

export type EditItemFormValues = ItemBaseFormValues & {
  images: File[] | string[];
};
