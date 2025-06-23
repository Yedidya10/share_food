import { DataTable } from "@/components/usersDataTable/DataTable";
import { Columns } from "@/components/usersDataTable/Columns";

export default function UsersPage() {
  return <DataTable columns={Columns} />;
}
