import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/shadcn/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import Toast from "@/Components/Toast";
import { Access, PageProps, Role } from "@/types";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface AddAccessDialogRef {
    open: () => void;
    close: () => void;
}

type AddAccessDialogProps = {
    roles: Role[];
    accesses: Access[];
    onSuccess?: () => void;
    onError: (message: string) => void;
};

type AccessRequest = {
    role: string;
    access_lists: Array<string>;
};

const AddAccessDialog = ({ roles, accesses, onSuccess, onError }: AddAccessDialogProps, ref: ForwardedRef<AddAccessDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<AccessRequest>({
        role: "",
        access_lists: [],
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
        post(route("app.access.store"), {
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

    const handleCheckedItem = (value: string, isChecked: boolean) => {
        if (!isChecked) {
            setData({
                ...data,
                ...{ access_lists: data.access_lists.filter((item) => value === item) },
            });
        } else {
            setData({
                ...data,
                ...{ access_lists: [...data.access_lists, value] },
            });
        }
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>Tambah Akses</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Select
                    className="w-full"
                    placeholder="Select Role"
                    selectLabel="Select Role"
                    value={data.role}
                    onValueChange={(value) => setData("role", value)}
                    items={roles.map((role) => {
                        return { value: role.id!, label: role.name };
                    })}
                    error={errors.role}
                />
                <Command className={`rounded-lg border shadow-md ${errors.access_lists ? "border-red-500" : ""}`}>
                    <CommandInput placeholder="Cari Akses..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {accesses.map((item) => {
                                return (
                                    <CommandItem key={item.code} className="space-x-2">
                                        <Checkbox value={item.code} onCheckedChange={(e) => handleCheckedItem(item.code, e.valueOf() as boolean)} />
                                        <span>{item.name}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
                {errors.access_lists && <span className="text-xs text-red-600 dark:text-red-500">{errors.access_lists}</span>}
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

export default forwardRef<AddAccessDialogRef, AddAccessDialogProps>(AddAccessDialog);
