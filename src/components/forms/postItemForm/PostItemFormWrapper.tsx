"use client";

import { TranslationType } from "@/types/translation";
import dynamic from "next/dynamic";

const PostItemForm = dynamic(() => import("../postItemForm/PostItemForm"), {
  ssr: false,
});

export default function PostItemFormWrapper(props: {
  translation: TranslationType;
  openModal: boolean;
  onClose: () => void;
}) {
  if (!props.openModal) return null;

  return <PostItemForm {...props} />;
}
