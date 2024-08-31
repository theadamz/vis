import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { InspectionColumns } from "@/Components/datatables/columns/InspectionColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import DateRangePicker from "@/Components/DateRangePicker";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { InspectionForm, PageProps, UserDataTable, VehicleType } from "@/types";
import { IInspectionDataTablePagination } from "@/types/datatables";
import { DateDefault, getStage, Stage } from "@/types/enum";
import { dateJSToFormat } from "@/utils/dateHandler";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, usePage } from "@inertiajs/react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

const defaultDateStart = dateJSToFormat(DateTime.fromJSDate(new Date()).minus({ months: 3 }).toJSDate(), DateDefault.DATE);
const defaultDateEnd = dateJSToFormat(new Date(), DateDefault.DATE);

const Index = ({ datatable, vehicleTypes }: PageProps<{ datatable: IInspectionDataTablePagination; vehicleTypes: VehicleType[] }>): JSX.Element => {
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
        router.visit(route("ins.inspection.edit", { id: data.id }));
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
        router.delete(route("ins.inspection.destroy"), {
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
        router.visit(route("ins.inspection.create"), {
            replace: true,
        });
    };

    const handleFilters = (field: string, value: any) => {
        setQueryStrings({
            ...queryStrings,
            ...{ [field]: value },
        });
    };

    const handleFilterDateRange = (from: Date, to: Date) => {
        setQueryStrings({
            ...queryStrings,
            ...{
                date_start: dateJSToFormat(from, DateDefault.DATE),
                date_end: dateJSToFormat(to, DateDefault.DATE),
            },
        });
    };

    const handleFilterClear = () => {
        setQueryStrings({
            date_start: defaultDateStart,
            date_end: defaultDateEnd,
        });
        dataTable.current?.resetFilters();
    };

    return (
        <>
            <Head title="Vehicle Inspections" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Vehicle Inspections</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Inspection" }, { label: "Vehicle Inspections" }]} />
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
                        <DateRangePicker
                            className={"w-auto"}
                            value={{
                                from: !queryStrings ? new Date(defaultDateStart) : queryStrings["date_start"] ? new Date(queryStrings["date_start"]) : new Date(defaultDateStart),
                                to: !queryStrings ? new Date(defaultDateEnd) : queryStrings["date_start"] ? new Date(queryStrings["date_end"]) : new Date(defaultDateEnd),
                            }}
                            onClosed={(date) => {
                                if (!date?.from || !date.to) return;
                                if (dateJSToFormat(date.from, DateDefault.DATE) === defaultDateStart && dateJSToFormat(date.to, DateDefault.DATE) === defaultDateEnd) return;
                                if (queryStrings && date.from === new Date(queryStrings["date_start"]) && date.to === new Date(queryStrings["date_end"])) return;
                                handleFilterDateRange(date.from, date.to);
                            }}
                        />
                        <Select
                            className="w-auto"
                            placeholder="Filter Vehicle Type"
                            selectLabel="Filter Vehicle Type"
                            value={!queryStrings ? "" : queryStrings["vehicle_type"] ? queryStrings["vehicle_type"] : ""}
                            onValueChange={(value) => handleFilters("vehicle_type", value)}
                            items={vehicleTypes.map((vehicleType) => {
                                return { value: vehicleType.id!, label: vehicleType.name };
                            })}
                        />
                        <Select
                            className="w-auto"
                            placeholder="Filter Stage"
                            selectLabel="Filter Stage"
                            value={!queryStrings ? "" : queryStrings["stage"] ? queryStrings["stage"] : ""}
                            onValueChange={(value) => handleFilters("stage", value)}
                            items={Object.entries(Stage).map(([label, value]) => {
                                return { value: value, label: getStage(value, "label") };
                            })}
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
                            columnDefs={InspectionColumns}
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
