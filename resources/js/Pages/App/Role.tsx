import Alert from "@/Components/Alert";
import AlertDialog, { AlertDialogRef } from "@/Components/AlertDialog";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { RoleColumns } from "@/Components/datatables/columns/RoleColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import ErrorDialog, { ErrorDialogRef } from "@/Components/ErrorDialog";
import { Button } from "@/Components/shadcn/ui/button";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { Separator } from "@/Components/shadcn/ui/separator";
import Toast from "@/Components/Toast";
import { PageProps, Role } from "@/types";
import { IRoleDataTablePagination } from "@/types/datatables";
import { axiosCustom } from "@/utils/axiosCustom";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { HttpStatusCode } from "axios";
import { FormEventHandler, ReactNode, useRef, useState } from "react";

const RolePage = ({ datatable }: PageProps<{ datatable: IRoleDataTablePagination }>): ReactNode => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<Role>({
        id: null,
        name: "",
        def_path: "",
    });

    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);
    const alertDialog = useRef<AlertDialogRef>(null);
    const errorDialog = useRef<ErrorDialogRef>(null);

    /*** componenet state ***/
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [checkedData, setCheckedData] = useState<Array<Role> | null>(null);

    /*** events ***/
    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        if (isEdit) {
            put(route("app.role.update", { id: data.id }), {
                onSuccess: (response) => {
                    const props = response.props as PageProps;
                    const flash = props.flash;
                    if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                    resetForm();
                },
                onError: (errors) => {
                    if (errors.message) {
                        errorDialog.current?.show({ message: errors.message });
                    } else {
                        Toast({ variant: "warning", title: "Warning", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        } else {
            post(route("app.role.store"), {
                onSuccess: (response) => {
                    const props = response.props as PageProps;
                    const flash = props.flash;
                    if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                    resetForm();
                },
                onError: (errors) => {
                    if (errors.message) {
                        errorDialog.current?.show({ message: errors.message });
                    } else {
                        Toast({ variant: "warning", title: "Warning", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        }
    };

    const resetForm = () => {
        reset(); // clear form to initial values
        clearErrors(); // clear errors
        setIsEdit(false); // set flag edit
        setCheckedData(null); // set checked data
    };

    const handleEdit = async (role: Role) => {
        // clear error
        clearErrors();

        // request get data
        const response = await axiosCustom({ url: route("app.role.read", { id: role.id }) });
        if (![HttpStatusCode.Ok].includes(response.status)) {
            Toast({ variant: "warning", title: "Warning", description: response.data.message });
            return;
        }

        // get data
        const data: Role = response.data.data;

        // set data to form
        setData({
            id: data.id,
            name: data.name,
            def_path: data.def_path,
        });

        // set flag edit
        setIsEdit(true);
    };

    const handleDelete = (data: Array<Role>) => {
        // open dialog and set data to state
        alertDialog.current?.open({ description: `Are you sure want to delete ${data.length} data?` });

        // set checked data
        setCheckedData(data);
    };

    const handleConfirmationDelete = (result: boolean) => {
        // if result false then stop
        if (!result) return;

        // get only id with map
        const ids = checkedData!.map((item) => item.id);

        // delete
        router.delete(route("app.role.destroy"), {
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
                    Toast({ variant: "warning", title: "Warning", description: refactorErrorMessage(errors) });
                }
            },
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Roles" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Roles</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Application" }, { label: "Roles" }]} />
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

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex flex-row gap-8">
                        <div className="basis-2/5">
                            <form onSubmit={submitForm}>
                                <div className="grid gap-2 mb-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        maxLength={50}
                                        required
                                        onChange={(e) => setData("name", e.target.value)}
                                        value={data.name}
                                        error={errors.name}
                                    />
                                </div>
                                <div className="grid gap-2 mb-3">
                                    <Label htmlFor="def_path">Path</Label>
                                    <Input
                                        id="def_path"
                                        name="def_path"
                                        type="text"
                                        placeholder="Path"
                                        maxLength={50}
                                        required
                                        onChange={(e) => setData("def_path", e.target.value)}
                                        value={data.def_path}
                                        error={errors.def_path}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <Button type="button" onClick={resetForm}>
                                            <Cross2Icon className="mr-2 h-4 w-4" />
                                            Clear
                                        </Button>
                                        <Button type="submit" disabled={processing} variant={"outline"}>
                                            {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="basis-3/5">
                            <DataTablePagination
                                ref={dataTable}
                                columnDefs={RoleColumns}
                                data={datatable}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                containerClass="rounded-sm border"
                                scrollAreaClass="h-96"
                                useShowHideColumn={false}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RolePage;
