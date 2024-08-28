import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { InspectionFormColumns } from "@/Components/datatables/columns/InspectionFormColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { InspectionForm, PageProps, UserDataTable, VehicleType } from "@/types";
import { IInspectionFormDataTablePagination } from "@/types/datatables";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, usePage } from "@inertiajs/react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";

const Index = ({ datatable, vehicleTypes }: PageProps<{ datatable: IInspectionFormDataTablePagination; vehicleTypes: VehicleType[] }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);

    /*** componenet state ***/
    const [checkedData, setCheckedData] = useState<Array<UserDataTable> | null>(null);
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleEdit = async (data: InspectionForm) => {
        router.visit(route("ins.form.edit", { id: data.id }));
    };

    const handleDelete = (data: Array<UserDataTable>) => {
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
        router.delete(route("ins.form.destroy"), {
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
        router.visit(route("ins.form.create"), {
            replace: true,
        });
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
            <Head title="Forms" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Forms</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Inspection" }, { label: "Forms" }]} />
                </div>
                <Button type="button" variant={"success"} onClick={handleFormOpen}>
                    <PlusIcon className="mr-2 h-4 w-4 stroke-white" />
                    Create
                </Button>
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

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex space-x-2">
                        <Select
                            className="w-[180px]"
                            placeholder="Filter Vehicle Type"
                            selectLabel="Filter Vehicle Type"
                            value={queryStrings ? queryStrings["vehicle_type"] : ""}
                            onValueChange={(value) => handleFilters("vehicle_type", value)}
                            items={vehicleTypes.map((vehicleType) => {
                                return { value: vehicleType.id!, label: vehicleType.name };
                            })}
                        />
                        <Select
                            className="w-[180px]"
                            placeholder="Filter ETA"
                            selectLabel="Filter ETA"
                            value={!queryStrings ? "" : queryStrings["use_eta_dest"] ? (queryStrings["use_eta_dest"] === true ? "true" : "false") : ""}
                            onValueChange={(value) => handleFilters("use_eta_dest", value)}
                            items={[
                                { value: "true", label: "Yes" },
                                { value: "false", label: "No" },
                            ]}
                        />
                        <Select
                            className="w-[180px]"
                            placeholder="Filter ATA"
                            selectLabel="Filter ATA"
                            value={!queryStrings ? "" : queryStrings["use_ata_dest"] ? (queryStrings["use_ata_dest"] === true ? "true" : "false") : ""}
                            onValueChange={(value) => handleFilters("use_ata_dest", value)}
                            items={[
                                { value: "true", label: "Yes" },
                                { value: "false", label: "No" },
                            ]}
                        />
                        <Select
                            className="w-[180px]"
                            placeholder="Filter Publish"
                            selectLabel="Filter Publish"
                            value={!queryStrings ? "" : queryStrings["publish"] ? (queryStrings["publish"] === true ? "true" : "false") : ""}
                            onValueChange={(value) => handleFilters("publish", value)}
                            items={[
                                { value: "true", label: "Yes" },
                                { value: "false", label: "No" },
                            ]}
                        />

                        {queryStrings && (
                            <Button aria-label="Reset filters" variant="ghost" className="px-2 lg:px-3" onClick={() => handleFilterClear()}>
                                Reset Filters
                                <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-row gap-8">
                        <DataTablePagination
                            ref={dataTable}
                            columnDefs={InspectionFormColumns}
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
