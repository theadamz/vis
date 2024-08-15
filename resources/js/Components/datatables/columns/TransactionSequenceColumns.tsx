import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { TransactionType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import CaretColumn from "../CaretColumn";

const columns: ColumnDef<TransactionType, unknown>[] = [
    {
        id: "select",
        meta: {
            headerClassName: "w-[40px]", // fixed width
        },
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "transaction_type_name",
        header: "Tipe Transaksi",
        meta: {
            columnDisplayName: "Tipe Transaksi", // Column display name
        },
    },
    {
        accessorKey: "site_name",
        header: "Site",
        meta: {
            columnDisplayName: "Site", // Column display name
        },
    },
    {
        accessorKey: "year",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Tahun
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Tahun", // Column display name
        },
    },
    {
        accessorKey: "month",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Bulan
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Bulan", // Column display name
        },
    },
    {
        accessorKey: "next_no",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    No. Selanjutnya
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "No. Selanjutnya", // Column display name
        },
    },
];

export default columns;
