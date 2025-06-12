import { InitialValues } from "@/types/forms/item/item";

export function postItemDefaultFormValues(translation: {
  countries: { [key: string]: string };
}) {
  return {
    title: "",
    description: "",
    streetName: "",
    streetNumber: "",
    city: "",
    country: translation.countries.israel, // Default
    postalCode: "",
    contactViaSite: true, // Default to true for contact via site
    contactByPhone: false,
    contactByEmail: false,
    phoneNumber: "",
    isHaveWhatsApp: false,
    email: "",
    images: [] as File[],
  };
}

export const editItemDefaultFormValues = ({
  initialValues,
}: {
  translation: {
    countries: { [key: string]: string };
  };
  initialValues: InitialValues;
}) => {
  return {
    title: initialValues.title,
    description: initialValues.description,
    streetName: initialValues.streetName,
    streetNumber: initialValues.streetNumber,
    city: initialValues.city,
    country: initialValues.country,
    postalCode: initialValues.postalCode,
    contactByPhone: initialValues.contactByPhone,
    contactByEmail: initialValues.contactByEmail,
    phoneNumber: initialValues.phoneNumber,
    isHaveWhatsApp: initialValues.isHaveWhatsApp,
    email: initialValues.email,
    images: initialValues.images,
  };
};
