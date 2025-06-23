import { FormTranslationType } from "@/types/formTranslation";
import { EditItemFormValues } from "@/types/item/item";

export function postItemDefaultFormValues(translation: FormTranslationType) {
  return {
    title: "",
    description: "",
    streetName: "",
    streetNumber: "",
    city: "",
    country: translation.israel, // Default
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
  translation: FormTranslationType;
  initialValues: EditItemFormValues;
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
    contactByPhone: initialValues.contactByPhone,
    contactByEmail: initialValues.contactByEmail,
    phoneNumber: initialValues?.phoneNumber || "",
    isHaveWhatsApp: initialValues.isHaveWhatsApp,
    email: initialValues?.email || "",
  };
};
