import { EditItemFormWrapper } from "@/components/forms/editItemForm/EditItemFormWrapper";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  return <EditItemFormWrapper itemId={itemId} />;
}
