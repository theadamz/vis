import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { PageProps, TransactionType } from "@/types";
import { usePage } from "@inertiajs/react";
import { DotsHorizontalIcon, Pencil1Icon } from "@radix-ui/react-icons";
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
        enableHiding: false,
    },
    {
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Kode
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Kode", // Column display name
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Nama
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Nama", // Column display name
        },
    },
    {
        accessorKey: "prefix",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Prefix
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Prefix", // Column display name
        },
    },
    {
        accessorKey: "suffix",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Suffix
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Suffix", // Column display name
        },
    },
    {
        accessorKey: "format_seq",
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0">
                    Format No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Format No.", // Column display name
        },
    },
    {
        id: "actions",
        enableHiding: false,
        meta: {
            headerClassName: "w-[40px]", // fixed width
        },
        cell: ({ row, table }) => {
            const permissions = usePage<PageProps>().props.access.permissions;
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open actions</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {permissions.edit && (
                            <DropdownMenuItem onClick={() => table.options.meta?.onEdit(item)}>
                                <Pencil1Icon className="mr-2" /> Edit
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default columns;
