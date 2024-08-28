import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { InspectionFormCategory, InspectionFormCheck } from "@/types";
import { CheckType } from "@/types/enum";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler, ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface FormCheckDialogRef {
    open: (category: InspectionFormCategory) => void;
    edit: (category: InspectionFormCategory, data: InspectionFormCheck) => void;
    close: () => void;
}

type FormCheckDialogProps = {
    onSubmit: (check: InspectionFormCheck) => void;
};

const FormCheckDialog = ({ onSubmit }: FormCheckDialogProps, ref: ForwardedRef<FormCheckDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, clearErrors, processing, reset } = useForm<InspectionFormCheck>({
        id: undefined,
        inspection_form_category_id: "",
        description: "",
        type: CheckType.SELECT,
        order: 1,
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: (category: InspectionFormCategory) => handleOpen(category),
        edit: (category: InspectionFormCategory, data: InspectionFormCheck) => handleEdit(category, data),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [category, setCategory] = useState<string>("");

    /*** events ***/
    const handleOpen = (category: InspectionFormCategory) => {
        setData("inspection_form_category_id", category.id!);
        setCategory(category.description);
        setOpenForm(true);
    };

    const handleEdit = (category: InspectionFormCategory, data: InspectionFormCheck) => {
        setIsEdit(true);
        setOpenForm(true);
        setCategory(category.description);
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
        setCategory("");
    };

    const submitForm: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Check" : "Add Check"}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={submitForm}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Input id="category" name="category" type="text" placeholder="Category" value={category} className="col-span-3 border-none p-0" readOnly />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Description"
                                className="col-span-3"
                                maxLength={100}
                                required
                                onChange={(e) => setData("description", e.target.value)}
                                value={data.description}
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select
                                className="col-span-3"
                                placeholder="Type"
                                selectLabel="Type"
                                value={data.type}
                                onValueChange={(value) => setData("type", value as CheckType)}
                                items={Object.entries(CheckType).map(([label, value]) => {
                                    return { value: value, label: label };
                                })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="order" className="text-right">
                                Order
                            </Label>
                            <Input
                                id="order"
                                name="order"
                                type="number"
                                placeholder="Order"
                                className="col-span-3"
                                required
                                onChange={(e) => setData("order", Number(e.target.value))}
                                value={data.order}
                            />
                        </div>
                    </div>
                    <DialogFooter className="w-full justify-between mt-5">
                        <Button type="button" onClick={handleClose}>
                            <Cross2Icon className="mr-2 h-4 w-4" />
                            Close
                        </Button>
                        <Button type="submit" disabled={processing} variant={"outline"}>
                            {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<FormCheckDialogRef, FormCheckDialogProps>(FormCheckDialog);
