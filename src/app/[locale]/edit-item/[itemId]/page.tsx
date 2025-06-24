import { EditItemFormWrapper } from "@/components/editItemDialog/EditItemFormWrapper";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  return <EditItemFormWrapper itemId={itemId} />;
}
