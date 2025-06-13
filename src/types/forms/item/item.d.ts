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
  phoneNumber?: string;
  isHaveWhatsApp: boolean;
  email?: string;
};

export type dBitem = {
  id: string;
  title: string;
  description: string;
  images: string[];
  street_name: string;
  street_number: string;
  city: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_have_whatsapp: boolean;
  email: string;
  status: "published" | "pending" | "draft";
  user_id: string;
  created_at: string;
};

// Extend the default form values with images
export type PostItemFormValues = ItemBaseFormValues & {
  images: File[];
};

export type EditItemFormValues = ItemBaseFormValues & {
  images: File[] | string[];
  itemId: string;
};
