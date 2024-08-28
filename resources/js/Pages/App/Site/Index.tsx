import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { SiteColumns } from "@/Components/datatables/columns/SiteColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import { Button } from "@/Components/shadcn/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/shadcn/ui/select";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { PageProps, Role, Site } from "@/types";
import { ISiteDataTablePagination } from "@/types/datatables";
import { axiosCustom } from "@/utils/axiosCustom";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, usePage } from "@inertiajs/react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import FormDialog, { FormDialogRef } from "./FormDialog";

const Index = ({ datatable }: PageProps<{ datatable: ISiteDataTablePagination }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);
    const formDialog = useRef<FormDialogRef>(null);

    /*** componenet state ***/
    const [checkedData, setCheckedData] = useState<Array<Role> | null>(null);
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleEdit = async (site: Site) => {
        const response = await axiosCustom({ url: route("app.site.read", { id: site.id }) });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            Toast({ variant: "warning", description: response.data.message });
            return;
        }

        const data: Site = response.data.data;

        formDialog.current?.edit(data);
    };

    const handleDelete = (data: Array<Role>) => {
        // open dialog and set data to state
        alertDialog.current?.open({ description: `Are you sure want to delete ${data.length} data?` });
        setCheckedData(data);
    };

    const handleConfirmationDelete = (result: boolean) => {
        // if result false then stop
        if (!result) return;

        // get only id
        const ids = checkedData!.map((item) => item.id);

        // delete
        router.delete(route("app.site.destroy"), {
            data: { ids: ids },
            onSuccess: (response) => {
                const props = response.props as PageProps;
                const flash = props.flash;
                if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });

                dataTable.current?.clearSelectedRows();
                setCheckedData(null);
            },
            onError: (errors) => {
                if (errors.message) {
                    errorDialog.current?.show({ message: errors.message });
                } else {
                    Toast({ variant: "warning", description: refactorErrorMessage(errors) });
                }
            },
            preserveState: true,
        });
    };

    const handleFormOpen = () => {
        formDialog.current?.open();
    };

    const handleError = (message: string) => {
        errorDialog.current?.show({ message: message });
    };

    const handleFilters = (field: string, value: any) => {
        setQueryStrings({
            ...queryStrings,
            ...{ [field]: value },
        });
    };

    const handleFilterClear = () => {
        setQueryStrings(undefined);
        dataTable.current?.resetFilters();
    };

    return (
        <>
            <Head title="Sites" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Site</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Application" }, { label: "Sites" }]} />
                </div>
                <div className="flex space-x-2">
                    {props.access.permissions.create && (
                        <Button type="button" variant={"success"} onClick={handleFormOpen}>
                            <PlusIcon className="mr-2 h-4 w-4 stroke-white" />
                            Add
                        </Button>
                    )}
                </div>
            </header>

            {/* backend alert */}
            {props.flash.alert && (
                <div className="p-4">
                    <Alert variant={props.flash.alert.variant as any} icon={props.flash.alert.icon} title={props.flash.alert.title} message={props.flash.alert.message} />
                </div>
            )}

            {/* error dialog */}
            <ErrorDialog ref={errorDialog} />

            {/* alert dialog (confirmation) */}
            <AlertDialog ref={alertDialog} onClose={handleConfirmationDelete} />

            {/* form input */}
            <FormDialog ref={formDialog} onError={handleError} />

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex space-x-2">
                        <Select
                            value={!queryStrings ? "" : queryStrings["active"] === true ? "true" : "false"}
                            onValueChange={(value) => handleFilters("active", value === "true")}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Active" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Filter Active</SelectLabel>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {queryStrings && (
                            <Button aria-label="Reset filters" variant="ghost" className="px-2 lg:px-3" onClick={() => handleFilterClear()}>
                                Reset Filters
                                <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-row">
                        <DataTablePagination
                            ref={dataTable}
                            columnDefs={SiteColumns}
                            data={datatable}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            containerClass="rounded-sm border"
                            scrollAreaClass="h-96"
                            additionalQueryStrings={queryStrings}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
