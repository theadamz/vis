import { Badge } from "@/Components/shadcn/ui/badge";
import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { PageProps, Role } from "@/types";
import { InspectionType } from "@/types/enum";
import { sortHandler } from "@/utils/datatables";
import { usePage } from "@inertiajs/react";
import { DotsHorizontalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import CaretColumn from "../CaretColumn";

export const InspectionFormColumns: ColumnDef<Role, unknown>[] = [
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
        accessorKey: "vehicle_type_name",
        enableResizing: true,
        header: "Vehicle Type",
        meta: {
            headerClassName: "w-[150px]", // fixed width
            columnDisplayName: "Vehicle Type", // Column display name
        },
    },
    {
        accessorKey: "type",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Type
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => Object.keys(InspectionType)[Object.values(InspectionType).indexOf(row.getValue("type") as InspectionType)],
        meta: {
            headerClassName: "w-[120px]", // fixed width
            columnDisplayName: "Type", // Column display name
        },
    },
    {
        accessorKey: "code",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Code
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            headerClassName: "w-[200px]", // fixed width
            columnDisplayName: "Code", // Column display name
        },
    },
    {
        accessorKey: "name",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Name
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Name", // Column display name
        },
    },
    {
        accessorKey: "use_eta_dest",
        enableResizing: true,
        meta: {
            headerClassName: "w-[100px] text-center",
            columnDisplayName: "Use ETA", // Column display name
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Use ETA
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_eta_dest") ? "outline" : "warning"}>{row.getValue("use_eta_dest") ? "Ya" : "Tidak"}</Badge>,
    },
    {
        accessorKey: "use_ata_dest",
        enableResizing: true,
        meta: {
            headerClassName: "w-[100px] text-center",
            columnDisplayName: "Use ATA", // Column display name
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Use ATA
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
    },
    {
        accessorKey: "is_publish",
        enableResizing: true,
        meta: {
            headerClassName: "w-[100px] text-center",
            columnDisplayName: "Publish", // Column display name
        },
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Publish
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("is_publish") ? "outline" : "warning"}>{row.getValue("is_publish") ? "Ya" : "Tidak"}</Badge>,
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
