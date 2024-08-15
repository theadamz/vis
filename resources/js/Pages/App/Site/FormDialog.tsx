import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { Textarea } from "@/Components/shadcn/ui/textarea";
import Toast from "@/Components/Toast";
import { PageProps, Site } from "@/types";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler, ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface FormDialogRef {
    open: () => void;
    edit: (data: Site) => void;
    close: () => void;
}

type FormDialogProps = {
    onError: (message: string) => void;
};

const FormDialog = ({ onError }: FormDialogProps, ref: ForwardedRef<FormDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm<Site>({
        id: null,
        code: "",
        name: "",
        address: "",
        is_active: true,
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        edit: (data: Site) => handleEdit(data),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    /*** events ***/
    const handleOpen = () => {
        setOpenForm(true);
    };

    const handleEdit = (data: Site) => {
        setIsEdit(true);
        setOpenForm(true);
        setData(data);
    };

    const handleClose = () => {
        resetForm();
        setOpenForm(false);
    };

    const resetForm = () => {
        reset();
        clearErrors();
        setIsEdit(false);
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        if (isEdit) {
            put(route("app.site.update", { id: data.id }), {
                onSuccess: (response) => {
                    const props = response.props as PageProps;
                    const flash = props.flash;
                    if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                    handleClose();
                },
                onError: (errors) => {
                    if (errors.message) {
                        onError(errors.message);
                    } else {
                        Toast({ variant: "warning", title: "Peringatan", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        } else {
            post(route("app.site.store"), {
                onSuccess: (response) => {
                    const props = response.props as PageProps;
                    const flash = props.flash;
                    if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                    handleClose();
                },
                onError: (errors) => {
                    if (errors.message) {
                        onError(errors.message);
                    } else {
                        Toast({ variant: "warning", title: "Peringatan", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        }
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Site" : "Buat Site"}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={submitForm}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Kode
                            </Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                placeholder="Kode"
                                className="col-span-3"
                                maxLength={5}
                                required
                                onChange={(e) => setData("code", e.target.value)}
                                value={data.code}
                                error={errors.code}
                                showErrorMessage={false}
                            />
                            {errors.code && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.code}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nama"
                                className="col-span-3"
                                maxLength={100}
                                required
                                onChange={(e) => setData("name", e.target.value)}
                                value={data.name}
                                error={errors.name}
                                showErrorMessage={false}
                            />
                            {errors.name && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.name}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Alamat
                            </Label>
                            <Textarea
                                id="address"
                                name="address"
                                placeholder="Alamat"
                                maxLength={255}
                                className="col-span-3"
                                onChange={(e) => setData("address", e.target.value)}
                                value={data.address}
                                error={errors.address}
                                showErrorMessage={false}
                            />
                            {errors.address && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.address}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="is_active" className="text-right">
                                Aktif
                            </Label>
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                defaultChecked={data.is_active}
                                onCheckedChange={(e) => {
                                    setData("is_active", e.valueOf() as boolean);
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter className="justify-between">
                        <Button type="button" onClick={handleClose}>
                            <Cross2Icon className="mr-2 h-4 w-4" />
                            Tutup
                        </Button>
                        <Button type="submit" disabled={processing} variant={"outline"}>
                            {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<FormDialogRef, FormDialogProps>(FormDialog);
