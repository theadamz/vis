import PaginationButtons from "@/Components/datatables/PaginationButtons";
import { cn } from "@/Components/shadcn";
import { Button } from "@/Components/shadcn/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { Input } from "@/Components/shadcn/ui/input";
import { ScrollArea } from "@/Components/shadcn/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/Components/shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/shadcn/ui/table";
import { PageProps } from "@/types";
import { IDataTablePagination } from "@/types/datatables";
import { fuzzyFilter } from "@/utils/datatables";
import { router, usePage } from "@inertiajs/react";
import { MixerHorizontalIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import numbro from "numbro";
import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";

export interface DataTableRef {
    refresh: () => void;
    resetFilters: () => void;
    clearSelectedRows: () => void;
}

type AddiotionalQueryString = {
    [field: string]: any;
};

type DataTableProps<TData, TValue> = {
    columnDefs: ColumnDef<TData, TValue>[];
    requestKeys?: string[];
    data: IDataTablePagination<TData>;
    type?: "simple" | "paging";
    useFirstLastPage?: boolean;
    leftSideCount?: number;
    rightSideCount?: number;
    containerClass?: string;
    scrollAreaClass?: string;
    useShowHideColumn?: boolean;
    additionalQueryStrings?: AddiotionalQueryString;
    onEdit?: (data: any) => void;
    onDelete?: (data: any[]) => void;
};

type QueryFilter = {
    page: number;
    per_page: number;
    sort: { field: string; direction: "asc" | "desc" };
};

const dataPerPage: number[] = [10, 25, 50, 100];

const DataTablePagination = <TData, TValue>(
    {
        columnDefs,
        requestKeys = ["datatable"],
        data,
        type = "paging",
        useFirstLastPage = false,
        leftSideCount,
        rightSideCount,
        containerClass,
        scrollAreaClass,
        useShowHideColumn = true,
        additionalQueryStrings,
        onEdit,
        onDelete,
    }: DataTableProps<TData, TValue>,
    ref: ForwardedRef<DataTableRef>
) => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** componenet state ***/
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [firstPage, setFirstPage] = useState<boolean>(true);
    const [query, setQuery] = useState<QueryFilter>({ page: data.current_page, per_page: data.per_page, sort: { field: "id", direction: "asc" } });

    /*** tanstack table ***/
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useMemo(() => columnDefs, []);
    const table = useReactTable({
        data: data.data,
        columns: columns,
        filterFns: { fuzzy: fuzzyFilter },
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        meta: {
            onEdit: (data: any) => onEdit && onEdit(data),
        },
        state: {
            sorting,
            columnVisibility,
        },
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        refresh: () => handleRefreshData(),
        resetFilters: () => handleResetFilters(),
        clearSelectedRows: () => handleClearSelectedRows(),
    }));

    /*** effect ***/
    useEffect(() => {
        let columnsVisibilities = {};
        table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
            .forEach((column) => {
                if (typeof column.columnDef.meta?.columnDisplay !== undefined) {
                    Object.assign(columnsVisibilities, { [column.id]: column.columnDef.meta?.columnDisplay });
                }
            });

        setColumnVisibility(columnsVisibilities);
    }, []);

    useEffect(() => {
        if (sorting.length > 0) {
            setQuery({ ...query, ...{ page: 1, sort: { field: sorting[0].id, direction: sorting[0].desc ? "desc" : "asc" } } });
        }

        if (sorting.length === 0 && firstPage === false) {
            setQuery({ ...query, ...{ page: 1, sort: { field: "id", direction: "asc" } } });
        }
    }, [sorting]);

    useEffect(() => {
        if (!firstPage) {
            retriveData();
        } else {
            setFirstPage(false);
        }
    }, [query]);

    /*** events ***/
    const retriveData = (): void => {
        router.visit(window.location.pathname, {
            only: requestKeys.includes("datatable") ? requestKeys : requestKeys.concat("datatable"),
            data: {
                ...query,
                ...additionalQueryStrings,
                ...{ sort: `${query.sort.field}.${query.sort.direction}`, search: search },
            },
            replace: true,
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleChangePerPage = (value: number) => {
        setQuery({
            ...query,
            ...{ per_page: value, page: 1 },
        });
    };

    const handleRefreshData = (): void => {
        setQuery({
            ...query,
            ...{ page: data.current_page },
        });
    };

    const handleResetFilters = (): void => {
        setSearch(undefined);
        setSorting([]);
        setQuery({ ...query, ...{ page: 1, sort: { field: "id", direction: "asc" } } });
    };

    const debounceSearch = debounce((value: string | undefined) => {
        router.visit(window.location.pathname, {
            only: requestKeys.includes("datatable") ? requestKeys : requestKeys.concat("datatable"),
            data: {
                ...query,
                ...additionalQueryStrings,
                ...{ sort: `${query.sort.field}.${query.sort.direction}`, page: 1, search: value },
            },
            replace: true,
            preserveScroll: true,
            preserveState: true,
        });
    }, 500);

    const executeSearch = useCallback((value: string | undefined) => debounceSearch(value), []);

    const handleSearch = (value: string) => {
        setFirstPage(true);
        setQuery({ ...query, ...{ page: 1 } });
        setSearch(value || undefined);
        executeSearch(value || undefined);
    };

    const handleDelete = () => {
        onDelete && onDelete(table.getFilteredSelectedRowModel().flatRows.map((item) => item.original));
    };

    const handleClearSelectedRows = () => {
        table.resetRowSelection();
    };

    /*** components ***/
    return (
        <div className="w-full">
            {/* Data Per Page, Search, Refresh */}
            <div className="flex items-center justify-between py-2">
                <div className="flex space-x-2">
                    <Select value={String(query.per_page)} onValueChange={(value) => handleChangePerPage(Number(value))}>
                        <SelectTrigger className="w-auto">
                            <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {dataPerPage.map((item) => (
                                    <SelectItem value={String(item)} key={String(item)} className="p-2 px-1.5">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {table.getFilteredSelectedRowModel().rows.length > 0 && props.access.permissions.delete && (
                        <Button type="button" variant="destructive" className="ml-2" onClick={handleDelete}>
                            <TrashIcon className="h-4 w-4 mr-2" /> Delete
                        </Button>
                    )}
                </div>
                <div className="flex space-x-2">
                    {useShowHideColumn && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-label="Toggle columns" variant="outline" size="icon" className="ml-auto hidden lg:flex">
                                    <MixerHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-auto">
                                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                <span className="truncate">{column.columnDef.meta?.columnDisplayName}</span>
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <div className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search..." className="pl-8" value={search ?? ""} onChange={(e) => handleSearch(e.target.value)} />
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="icon" className="ml-2" onClick={() => handleRefreshData()}>
                        <ReloadIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className={cn("w-full", containerClass)}>
                <ScrollArea className={cn(scrollAreaClass)}>
                    <Table>
                        <TableHeader className="sticky top-0 shadow-sm backdrop-blur-sm z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className={header.column.columnDef.meta?.headerClassName}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={cell.column.columnDef.meta?.cellClassName}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No matching records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            {/* Paging */}
            <div className="flex items-center justify-end space-x-2 pt-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length <= 0
                        ? `Page ${data.current_page} of ${data.last_page} (${numbro(data.total).format({ thousandSeparated: true })} entries)`
                        : `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected`}
                </div>
                <div className="space-x-2">
                    <PaginationButtons page={data} type={type} leftSidePageCount={leftSideCount} rightSidePageCount={rightSideCount} useFirstLastPage={useFirstLastPage} />
                </div>
            </div>
        </div>
    );
};

export default forwardRef<DataTableRef, DataTableProps<any, any>>(DataTablePagination);
