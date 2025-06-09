import { DataTable } from "@/components/dataTable/DataTable";
import { Columns } from "@/components/dataTable/Columns";

export default async function UsersPage() {
  try {
    return <DataTable columns={Columns} />;
  } catch (error) {
    console.error(error);
  }
}
