import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import ComboBox from "@/Components/ComboBox";
import UserColumns from "@/Components/datatables/columns/UserColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import Dialog, { DialogRef } from "@/Components/Dialog";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { PageProps, Role, Site, UserDataTable } from "@/types";
import { IUserDataTablePagination } from "@/types/datatables";
import { axiosCustom } from "@/utils/axiosCustom";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, usePage } from "@inertiajs/react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import Form from "./Form";

const Index = ({ datatable, roles, sites }: PageProps<{ datatable: IUserDataTablePagination; sites: Site[]; roles: Role[] }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);
    const formDialog = useRef<DialogRef>(null);

    /*** componenet state ***/
    const [checkedData, setCheckedData] = useState<Array<UserDataTable> | null>(null);
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);
    const [selectedUser, setSelectedUser] = useState<UserDataTable | undefined>(undefined);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleEdit = async (user: UserDataTable) => {
        const response = await axiosCustom({ url: route("app.user.read", { id: user.id }) });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            Toast({ variant: "warning", title: "Peringatan", description: response.data.message });
            return;
        }

        const data: UserDataTable = response.data.data;

        // set selected user
        setSelectedUser(data);

        formDialog.current?.open();
    };

    const handleDelete = (data: Array<UserDataTable>) => {
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
        router.delete(route("app.user.destroy"), {
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

    const handleFormClose = () => {
        setSelectedUser(undefined);
        formDialog.current?.close();
    };

    const handleFormError = (message: string) => {
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
            <Head title="Pengguna" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex py-2 px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Pengguna</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Aplikasi" }, { label: "Pengguna" }]} />
                </div>
                <Button type="button" variant={"success"} onClick={handleFormOpen}>
                    <PlusIcon className="mr-2 h-4 w-4 stroke-white" />
                    Buat
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

            {/* form input */}
            <Dialog ref={formDialog} title={selectedUser !== undefined ? "Edit Pengguna" : "Buat Pengguna"} className="w-full">
                <Form
                    edit={selectedUser !== undefined}
                    editData={selectedUser}
                    roles={roles.map((role) => {
                        return { value: role.id!, label: role.name };
                    })}
                    sites={sites.map((site) => {
                        return { value: site.id!, label: site.name };
                    })}
                    onSuccess={handleFormClose}
                    onError={handleFormError}
                    onCancel={handleFormClose}
                />
            </Dialog>

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex space-x-2">
                        <Select
                            className="w-[180px]"
                            placeholder="Filter Aktif"
                            selectLabel="Filter Aktif"
                            value={!queryStrings ? "" : queryStrings["active"] ? (queryStrings["active"] === true ? "true" : "false") : ""}
                            onValueChange={(value) => handleFilters("active", value)}
                            items={[
                                { value: "true", label: "Ya" },
                                { value: "false", label: "Tidak" },
                            ]}
                        />
                        <Select
                            className="w-[180px]"
                            placeholder="Filter Role"
                            selectLabel="Filter Role"
                            value={queryStrings ? queryStrings["role"] : ""}
                            onValueChange={(value) => handleFilters("role", value)}
                            items={roles.map((role) => {
                                return { value: role.id!, label: role.name };
                            })}
                        />
                        <ComboBox
                            className="w-[250px]"
                            placeholder="Filter Site"
                            defValue={queryStrings ? queryStrings["site"] : ""}
                            items={sites.map((site) => {
                                return { value: site.id!, label: site.name };
                            })}
                            onValueChange={(value) => handleFilters("site", value)}
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
                            columnDefs={UserColumns}
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
