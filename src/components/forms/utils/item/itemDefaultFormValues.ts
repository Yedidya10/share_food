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
    images: [],
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
    postalCode: initialValues?.postalCode || "",
    contactViaSite: true, // Default to true for contact via site
    contactByPhone: initialValues.contactByPhone || false,
    contactByEmail: initialValues.contactByEmail || false,
    phoneNumber: initialValues?.phoneNumber || "",
    isHaveWhatsApp: initialValues.isHaveWhatsApp || false,
    email: initialValues?.email || "",
  };
};
