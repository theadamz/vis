import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import TransactionTypeColumns from "@/Components/datatables/columns/TransactionTypeColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import { Button } from "@/Components/shadcn/ui/button";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { PageProps, Role, TransactionType } from "@/types";
import { ITransactionTypeDataTablePagination } from "@/types/datatables";
import { axiosCustom } from "@/utils/axiosCustom";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, usePage } from "@inertiajs/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { HttpStatusCode } from "axios";
import { useRef, useState } from "react";
import FormDialog, { FormDialogRef } from "./FormDialog";

const Index = ({
    datatable,
    formatSeqArray,
    formatSeqDefault,
}: PageProps<{ datatable: ITransactionTypeDataTablePagination; formatSeqArray: Array<{ [key: string]: string }>; formatSeqDefault: string }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);
    const formDialog = useRef<FormDialogRef>(null);

    /*** componenet state ***/
    const [checkedData, setCheckedData] = useState<Array<Role> | null>(null);

    /*** events ***/
    const handleEdit = async (type: TransactionType) => {
        const response = await axiosCustom({ url: route("app.transaction.type.read", { id: type.id }) });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            Toast({ variant: "warning", title: "Peringatan", description: response.data.message });
            return;
        }

        const data: TransactionType = response.data.data;

        formDialog.current?.edit(data);
    };

    const handleDelete = (data: Array<Role>) => {
        // open dialog and set data to state
        alertDialog.current?.open({ description: `Yakin akan hapus ${data.length} data?` });
        setCheckedData(data);
    };

    const handleConfirmationDelete = (result: boolean) => {
        // if result false then stop
        if (!result) return;

        // get only id
        const ids = checkedData!.map((item) => item.id);

        // delete
        router.delete(route("app.transaction.type.destroy"), {
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
                    Toast({ variant: "warning", title: "Peringatan", description: refactorErrorMessage(errors) });
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

    return (
        <>
            <Head title="Tipe Transaksi" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex py-2 px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Tipe Transaksi</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Aplikasi" }, { label: "Transaksi" }, { label: "Tipe" }]} />
                </div>
                <div className="flex space-x-2">
                    {props.access.permissions.create && (
                        <Button type="button" variant={"success"} onClick={handleFormOpen}>
                            <PlusIcon className="mr-2 h-4 w-4 stroke-white" />
                            Buat
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
            <FormDialog ref={formDialog} onError={handleError} formatSeqArray={formatSeqArray} formatSeqDefault={formatSeqDefault} />

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex flex-row">
                        <DataTablePagination
                            ref={dataTable}
                            columnDefs={TransactionTypeColumns}
                            data={datatable}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            containerClass="rounded-sm border"
                            scrollAreaClass="h-96"
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
