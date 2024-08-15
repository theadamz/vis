import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import Toast from "@/Components/Toast";
import { Access, PageProps } from "@/types";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface ModifyAccessDialogRef {
    open: (role: string, access: Access) => void;
    close: () => void;
}

type ModifyAccessDialogProps = {
    onSuccess?: () => void;
    onError: (message: string) => void;
};

type ModifyAccessRequest = {
    role: string;
    code: string;
    permissions: { [permisison: string]: boolean };
};

const ModifyAccessDialog = ({ onSuccess, onError }: ModifyAccessDialogProps, ref: ForwardedRef<ModifyAccessDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, put, processing, errors, clearErrors, reset } = useForm<ModifyAccessRequest>({
        role: "",
        code: "",
        permissions: {},
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: (role: string, access: Access) => handleOpen(role, access),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [accessName, setAccessName] = useState<string>("");

    /*** events ***/
    const handleOpen = (role: string, access: Access) => {
        setData({
            role: role,
            code: access.code,
            permissions: access.permissions,
        });
        setAccessName(access.name);
        setOpenForm(true);
    };

    const handleClose = () => {
        resetForm();
        setOpenForm(false);
    };

    const resetForm = () => {
        reset();
        clearErrors();
        setAccessName("");
    };

    const submitForm = () => {
        put(route("app.access.update"), {
            onSuccess: (response) => {
                const props = response.props as PageProps;
                const flash = props.flash;
                if (flash.toast) Toast({ variant: "success", title: flash.toast.title, description: flash.toast.message });
                handleClose();
                onSuccess && onSuccess();
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
    };

    const handleCheckedItem = (permission: string, check: boolean) => {
        setData({
            ...data,
            ...{
                permissions: { ...data.permissions, [permission]: check },
            },
        });
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>Edit Akses</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="access_name">Akses</Label>
                    <Input id="access_name" name="access_name" type="text" placeholder="Nama Akses" className="border-none p-0" value={accessName} readOnly />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="access_name">Perizinan</Label>
                    <div className="flex space-x-2">
                        {Object.entries(data.permissions).map(([permission, isAllowed]) => (
                            <div key={permission} className="flex items-center">
                                <Checkbox
                                    className="ml-2"
                                    defaultChecked={isAllowed}
                                    value={permission}
                                    onCheckedChange={(e) => handleCheckedItem(permission, e.valueOf() as boolean)}
                                />
                                <span className="ml-1">{permission}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {errors &&
                    Object.entries(errors).map((error, idx) => {
                        return (
                            <span key={error[0]} className="text-xs text-red-600 dark:text-red-500">
                                {error}
                            </span>
                        );
                    })}
                <DialogFooter className="justify-between">
                    <Button type="button" onClick={handleClose}>
                        <Cross2Icon className="mr-2 h-4 w-4" />
                        Tutup
                    </Button>
                    <Button type="submit" disabled={processing} variant={"outline"} onClick={submitForm}>
                        {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<ModifyAccessDialogRef, ModifyAccessDialogProps>(ModifyAccessDialog);
