import EditItemDialog from "@/components/editItemDialog/EditItemDialog";
import { EditItemFormWrapper } from "@/components/editItemDialog/EditItemFormWrapper";

export default async function EditItemModal({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  return (
    <EditItemDialog>
      <EditItemFormWrapper itemId={itemId} />
    </EditItemDialog>
  );
}
