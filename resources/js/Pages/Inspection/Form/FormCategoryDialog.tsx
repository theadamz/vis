import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { InspectionFormCategory } from "@/types";
import { getStage, Stage } from "@/types/enum";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CheckIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler, ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface FormCategoryDialogRef {
    open: () => void;
    edit: (data: InspectionFormCategory) => void;
    close: () => void;
}

type FormCategoryDialogProps = {
    onSubmit: (category: InspectionFormCategory) => void;
};

const FormCategoryDialog = ({ onSubmit }: FormCategoryDialogProps, ref: ForwardedRef<FormCategoryDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, clearErrors, processing, reset } = useForm<InspectionFormCategory>({
        id: undefined,
        inspection_form_id: undefined,
        stage: Stage.CHECKED_IN,
        description: "",
        order: 1,
        is_separate_page: false,
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        edit: (data: InspectionFormCategory) => handleEdit(data),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    /*** events ***/
    const handleOpen = () => {
        setOpenForm(true);
    };

    const handleEdit = (data: InspectionFormCategory) => {
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

        onSubmit(data);
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={submitForm}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stage" className="text-right">
                                Stage
                            </Label>
                            <Select
                                className="col-span-3"
                                placeholder="Stage"
                                selectLabel="Stage"
                                value={data.stage}
                                onValueChange={(value) => setData("stage", value as Stage)}
                                items={Object.entries(Stage).map(([label, value]) => {
                                    return { value: value, label: getStage(value, "label") };
                                })}
                            />
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="order" className="text-right">
                                Print Separate Page
                            </Label>
                            <Checkbox
                                className="col-span-3"
                                id="is_separate_page"
                                name="is_separate_page"
                                defaultChecked={data.is_separate_page}
                                checked={data.is_separate_page}
                                onCheckedChange={(e) => setData("is_separate_page", e.valueOf() as boolean)}
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

export default forwardRef<FormCategoryDialogRef, FormCategoryDialogProps>(FormCategoryDialog);
