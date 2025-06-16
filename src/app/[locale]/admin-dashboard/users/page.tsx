import { DataTable } from "@/components/dataTable/DataTable";
import { Columns } from "@/components/dataTable/Columns";

export default async function UsersPage() {
  try {
    return (
      <div className='h-[calc(100vh-80px)] overflow-hidden'>
        <DataTable columns={Columns} />
      </div>
    );
  } catch (error) {
    console.error(error);
  }
}
