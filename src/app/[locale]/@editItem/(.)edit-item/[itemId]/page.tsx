import { EditItemFormWrapper } from '@/components/forms/editItemForm/EditItemFormWrapper'
import EditItemFormDialog from '@/components/forms/editItemForm/EditItemFormDialog'

export default async function EditItemModal({
  params,
}: {
  params: Promise<{ itemId: string }>
}) {
  const { itemId } = await params
  return (
    <EditItemFormDialog>
      <EditItemFormWrapper itemId={itemId} />
    </EditItemFormDialog>
  )
}
