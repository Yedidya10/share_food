"use client";

import { InitialValues } from "@/types/forms/item/item";
import { TranslationType } from "@/types/translation";
import dynamic from "next/dynamic";

const EditItemForm = dynamic(() => import("./EditItemForm"), {
  ssr: false,
});

export default function EditItemFormWrapper(props: {
  itemId: string;
  itemStatus: string;
  setIsEditItemFormSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>;
  initialValues: InitialValues;
  translation: TranslationType;
  open: boolean;
  onClose: () => void;
}) {
  if (!props.open) return null;

  return <EditItemForm {...props} />;
}
