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

export const InspectionColumns: ColumnDef<Role, unknown>[] = [
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
        accessorKey: "vehicle_type",
        enableResizing: true,
        header: "Vehicle Type",
        meta: {
            headerClassName: "w-[150px]", // fixed width
            columnDisplayName: "Vehicle Type", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "doc_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Doc. No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => Object.keys(InspectionType)[Object.values(InspectionType).indexOf(row.getValue("type") as InspectionType)],
        meta: {
            headerClassName: "w-[120px]", // fixed width
            columnDisplayName: "Doc. No.", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "doc_date",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Doc. Date
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            headerClassName: "w-[200px]", // fixed width
            columnDisplayName: "Doc. Date", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "container_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Container No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Container No.", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "seal_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Seal No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_eta_dest") ? "outline" : "warning"}>{row.getValue("use_eta_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Seal No.", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "inspected_by",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Inspected By
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Inspected By", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "driver_name",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Driver Name
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Driver Name", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "driver_id_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Driver Identity No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Driver Identity No.", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "driver_pic",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Driver Picture
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Driver Picture", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "driver_phone_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Driver Phone No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Driver Phone No.", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "vehicle_reg_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Vch. Reg. No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Vch. Reg. No.", // Column display name
            columnDisplay: true,
        },
    },
    {
        accessorKey: "vehicle_paper_no",
        enableResizing: true,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Vch. Paper No.
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        cell: ({ row }) => <Badge variant={row.getValue("use_ata_dest") ? "outline" : "warning"}>{row.getValue("use_ata_dest") ? "Ya" : "Tidak"}</Badge>,
        meta: {
            headerClassName: "text-left",
            columnDisplayName: "Vch. Paper No.", // Column display name
            columnDisplay: true,
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
