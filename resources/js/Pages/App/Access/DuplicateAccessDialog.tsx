import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import Toast from "@/Components/Toast";
import { PageProps, Role } from "@/types";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface DuplicateAccessDialogRef {
    open: () => void;
    close: () => void;
}

type DuplicateAccessDialogProps = {
    roles: Role[];
    onSuccess?: () => void;
    onError: (message: string) => void;
};

type AccessDuplicateRequest = {
    from_role: string;
    to_role: string;
};

const DuplicateAccessDialog = ({ roles, onSuccess, onError }: DuplicateAccessDialogProps, ref: ForwardedRef<DuplicateAccessDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<AccessDuplicateRequest>({
        from_role: "",
        to_role: "",
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [openForm, setOpenForm] = useState<boolean>(false);

    /*** events ***/
    const handleOpen = () => {
        setOpenForm(true);
    };

    const handleClose = () => {
        resetForm();
        setOpenForm(false);
    };

    const resetForm = () => {
        reset();
        clearErrors();
    };

    const submitForm = () => {
        clearErrors();
        post(route("app.access.duplicate"), {
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
                    Toast({ variant: "warning", description: refactorErrorMessage(errors) });
                }
            },
            preserveState: true,
        });
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>Duplicate Access Role</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Select
                    className="w-full"
                    placeholder="From Role"
                    selectLabel="From Role"
                    value={data.from_role}
                    onValueChange={(value) => setData("from_role", value)}
                    items={roles.map((role) => {
                        return { value: role.id!, label: role.name };
                    })}
                    error={errors.from_role}
                />
                <Select
                    className="w-full"
                    placeholder="To Role"
                    selectLabel="To Role"
                    value={data.to_role}
                    onValueChange={(value) => setData("to_role", value)}
                    items={roles.map((role) => {
                        return { value: role.id!, label: role.name };
                    })}
                    error={errors.to_role}
                />
                <DialogFooter className="justify-between">
                    <Button type="button" onClick={handleClose}>
                        <Cross2Icon className="mr-2 h-4 w-4" />
                        Close
                    </Button>
                    <Button type="submit" disabled={processing} variant={"outline"} onClick={submitForm}>
                        {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<DuplicateAccessDialogRef, DuplicateAccessDialogProps>(DuplicateAccessDialog);
