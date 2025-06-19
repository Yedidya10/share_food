import { DataTable } from "@/components/dataTable/DataTable";
import { Columns } from "@/components/dataTable/Columns";

export default function UsersPage() {
  return <DataTable columns={Columns} />;
}
