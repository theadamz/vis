import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { AccessColumns } from "@/Components/datatables/columns/AccessColumns";
import { DataTableRef } from "@/Components/datatables/DataTablePagination";
import DataTablePaginationClient from "@/Components/datatables/DataTablePaginationClient";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { Access, PageProps, Role } from "@/types";
import { axiosCustom } from "@/utils/axiosCustom";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, usePage } from "@inertiajs/react";
import { CopyIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import AddAccessDialog, { AddAccessDialogRef } from "./AddAccessDialog";
import DuplicateAccessDialog, { DuplicateAccessDialogRef } from "./DuplicateAccessDialog";
import ModifyAccessDialog, { ModifyAccessDialogRef } from "./ModifyAccessDialog";

const Index = ({ accesses, roles }: PageProps<{ accesses: Access[]; roles: Role[] }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);
    const addAccessDialog = useRef<AddAccessDialogRef>(null);
    const modifyAccessDialog = useRef<ModifyAccessDialogRef>(null);
    const duplicateAccessDialog = useRef<DuplicateAccessDialogRef>(null);

    /*** componenet state ***/
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [accessData, setAccessData] = useState<Array<Access>>([]);
    const [checkedData, setCheckedData] = useState<Array<Access> | null>(null);

    /*** effect ***/
    useEffect(() => {
        if (selectedRole !== "") retriveData();
    }, [selectedRole]);

    /*** events ***/
    const retriveData = async () => {
        const response = await axiosCustom({ url: route("app.access.get-role-access", { roleId: selectedRole }) });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            Toast({ variant: "warning", description: response.data.message });
            setAccessData([]);
            return;
        }

        const data: Array<Access> = response.data.data;

        setAccessData(data);
    };

    const handleEdit = async (access: Access) => {
        const response = await axiosCustom({ url: route("app.access.read", { roleId: selectedRole, accessCode: access.code }) });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            Toast({ variant: "warning", description: response.data.message });
            return;
        }

        const data: Access = response.data.data;

        modifyAccessDialog.current?.open(selectedRole, data);
    };

    const handleDelete = (data: Array<Access>) => {
        // open dialog and set data to state
        alertDialog.current?.open({ description: `Are you sure want to delete ${data.length} data?` });
        setCheckedData(data);
    };

    const handleConfirmationDelete = (result: boolean) => {
        // if result false then stop
        if (!result) return;

        // get only id
        const ids = checkedData!.map((item) => item.code);

        // delete
        router.delete(route("app.access.destroy"), {
            data: { role: selectedRole, ids: ids },
            onSuccess: (response) => {
                const props = response.props as PageProps;
                const flash = props.flash;
                if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });

                dataTable.current?.clearSelectedRows();
                setCheckedData(null);
                retriveData();
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
        addAccessDialog.current?.open();
    };

    const handleError = (message: string) => {
        errorDialog.current?.show({ message: message });
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
    };

    return (
        <>
            <Head title="System Access" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">System Access</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Application" }, { label: "System Access" }]} />
                </div>
                <div className="flex space-x-2">
                    {props.access.permissions.create && (
                        <Button type="button" variant={"secondary"} onClick={() => duplicateAccessDialog.current?.open()}>
                            <CopyIcon className="mr-2 h-4 w-4 stroke-gray-500" />
                            Duplicate
                        </Button>
                    )}
                    {props.access.permissions.create && (
                        <Button type="button" variant={"success"} onClick={handleFormOpen}>
                            <PlusIcon className="mr-2 h-4 w-4 stroke-white" />
                            Access
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
            <AddAccessDialog ref={addAccessDialog} roles={roles} accesses={accesses} onSuccess={() => retriveData()} onError={handleError} />

            {/* form input edit */}
            <ModifyAccessDialog ref={modifyAccessDialog} onSuccess={() => retriveData()} onError={handleError} />

            {/* form input duplicate */}
            <DuplicateAccessDialog ref={duplicateAccessDialog} roles={roles} onSuccess={() => retriveData()} onError={handleError} />

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex space-x-2">
                        <Select
                            className="max-w-md"
                            placeholder="Filter Role"
                            selectLabel="Filter Role"
                            value={selectedRole}
                            onValueChange={(value) => handleRoleChange(value)}
                            items={roles.map((role) => {
                                return { value: role.id!, label: role.name };
                            })}
                        />
                        <Button type="button" variant="outline" size="icon" className="ml-2" onClick={() => retriveData()}>
                            <ReloadIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-row">
                        <DataTablePaginationClient
                            ref={dataTable}
                            columnDefs={AccessColumns}
                            data={accessData}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            containerClass="rounded-sm border"
                            scrollAreaClass="h-[35rem]"
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
