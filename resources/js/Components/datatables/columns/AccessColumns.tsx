import { Badge } from "@/Components/shadcn/ui/badge";
import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { PageProps, Role } from "@/types";
import { fuzzySort, sortHandler } from "@/utils/datatables";
import { usePage } from "@inertiajs/react";
import { DotsHorizontalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import CaretColumn from "../CaretColumn";

type Permisisons = { [key: string]: boolean };

export const AccessColumns: ColumnDef<Role, unknown>[] = [
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
        accessorKey: "name",
        enableResizing: true,
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
        header: ({ column }) => {
            return (
                <Button type="button" variant="ghost" onClick={() => column.toggleSorting(sortHandler(column.getIsSorted()))} className="p-0">
                    Access Name
                    <CaretColumn sort={column.getIsSorted()} />
                </Button>
            );
        },
        meta: {
            columnDisplayName: "Access Name", // Column display name
        },
    },
    {
        accessorKey: "permissions",
        enableResizing: true,
        header: "Permissions",
        cell: ({ row }) => {
            const permissions: Permisisons = row.getValue("permissions");
            return (
                <div className="space-x-2">
                    {Object.entries(permissions).map(([permisison, isAllowed]) => {
                        return (
                            <Badge key={permisison} variant={isAllowed ? "outline" : "destructive"}>
                                {permisison}
                            </Badge>
                        );
                    })}
                </div>
            );
        },
        meta: {
            columnDisplayName: "Permissions", // Column display name
            columnDisplay: true, // hide column after init
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
