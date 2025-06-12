import { z } from "zod";
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import { TranslationType } from "@/types/translation";

export function itemBaseSchema(translation: TranslationType) {
  return z.object({
    title: z
      .string()
      .min(5, { message: translation.titleMinLength })
      .max(50, { message: translation.titleMaxLength }),
    description: z
      .string({ required_error: translation.descriptionRequired })
      .min(10, { message: translation.descriptionMinLength })
      .max(300, { message: translation.descriptionMaxLength }),
  });
}

export function locationSchema(translation: TranslationType) {
  return z
    .object({
      streetName: z.string().min(2).max(50),
      streetNumber: z.string().min(1).max(10),
      city: z.string().min(2).max(10),
      postalCode: z.string().optional(),
      country: z.string().min(2).max(20),
    })
    .refine(
      (data) => data.postalCode?.trim() === "" || data.postalCode?.length === 7,
      {
        path: ["postalCode"],
        message: translation.postalCodeError,
      }
    );
}

export function contactSchema(translation: TranslationType) {
  return z
    .object({
      contactViaSite: z.boolean(),
      contactByPhone: z.boolean(),
      phoneNumber: z.string().optional(),
      isHaveWhatsApp: z.boolean(),
      contactByEmail: z.boolean(),
      email: z.string().optional(),
    })
    .refine(
      (data) =>
        !data.contactByPhone ||
        (data.phoneNumber?.trim() !== "" &&
          isValidPhoneNumber(data.phoneNumber ?? "") &&
          isPossiblePhoneNumber(data.phoneNumber ?? "")),
      {
        message: translation.phoneNumberError,
        path: ["phoneNumber"],
      }
    )
    .refine(
      (data) =>
        !data.contactByEmail ||
        (data.email?.trim() !== "" &&
          z.string().email().safeParse(data.email).success),
      {
        message: translation.emailError,
        path: ["email"],
      }
    );
}

export default function itemSchema(translation: TranslationType) {
  return itemBaseSchema(translation)
    .and(locationSchema(translation))
    .and(contactSchema(translation));
}
