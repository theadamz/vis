import { Button } from "@/Components/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import Toast from "@/Components/Toast";
import { PageProps, TransactionType } from "@/types";
import { refactorErrorMessage } from "@/utils/refactorMessages";
import { useForm } from "@inertiajs/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CheckIcon, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import { FormEventHandler, ForwardedRef, forwardRef, ReactNode, useEffect, useImperativeHandle, useState } from "react";

export interface FormDialogRef {
    open: () => void;
    edit: (data: TransactionType) => void;
    close: () => void;
}

type FormDialogProps = {
    formatSeqArray: Array<{ [key: string]: string }>;
    formatSeqDefault: string;
    onError: (message: string) => void;
};

const FormDialog = ({ formatSeqArray, formatSeqDefault, onError }: FormDialogProps, ref: ForwardedRef<FormDialogRef>): ReactNode => {
    /*** inertia js ***/
    const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm<TransactionType>({
        id: null,
        code: "",
        name: "",
        prefix: "",
        suffix: "",
        length_seq: 3,
        format_seq: formatSeqDefault,
    });

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        edit: (data: TransactionType) => handleEdit(data),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [previewFormatNumber, setPreviewFormatNumber] = useState<string>("");

    /*** effect ***/
    useEffect(() => {
        generatePreviewNumber();
    }, [data]);

    /*** events ***/
    const handleOpen = () => {
        setOpenForm(true);
    };

    const handleEdit = (data: TransactionType) => {
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
            put(route("app.transaction.type.update", { id: data.id }), {
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
                        Toast({ variant: "warning", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        } else {
            post(route("app.transaction.type.store"), {
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
                        Toast({ variant: "warning", description: refactorErrorMessage(errors) });
                    }
                },
                preserveState: true,
            });
        }
    };

    const handleButtonFormatNumber = (code: string) => {
        setData("format_seq", `${data.format_seq}${code}`);
    };

    const generatePreviewNumber = () => {
        let preview = data.format_seq;

        Object.entries(formatSeqArray).forEach((item) => {
            const element = String(item[1]).replace("{", "").replace("}", "");
            let value = "";

            switch (element) {
                case "year":
                    value = DateTime.now().toFormat("yy");
                    break;

                case "month":
                    value = DateTime.now().toFormat("LL");
                    break;

                case "seq":
                    value = "1".padStart(data.length_seq, "0");
                    break;

                case "site_code":
                    value = "SITE_CODE";
                    break;

                default:
                    value = Object.entries(data).find(([key, val]) => key === element)?.[1] as string;
                    break;
            }

            preview = preview.replaceAll(String(item[1]), value);
        });

        setPreviewFormatNumber(preview);
    };

    return (
        <Dialog open={openForm}>
            <DialogContent className="sm:max-w-[640px]" aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Transaction Type" : "Add Transaction Type"}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={submitForm}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                placeholder="Code"
                                className="col-span-3"
                                maxLength={20}
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
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Name"
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
                            <Label htmlFor="prefix" className="text-right">
                                Prefix
                            </Label>
                            <Input
                                id="prefix"
                                name="prefix"
                                type="text"
                                placeholder="Prefix"
                                className="col-span-3"
                                maxLength={20}
                                required
                                onChange={(e) => setData("prefix", e.target.value)}
                                onBlur={() => generatePreviewNumber()}
                                value={data.prefix}
                                error={errors.prefix}
                                showErrorMessage={false}
                            />
                            {errors.prefix && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.prefix}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="suffix" className="text-right">
                                Suffix
                            </Label>
                            <Input
                                id="suffix"
                                name="suffix"
                                type="text"
                                placeholder="Suffix"
                                className="col-span-3"
                                maxLength={20}
                                onChange={(e) => setData("suffix", e.target.value)}
                                onBlur={() => generatePreviewNumber()}
                                value={data.suffix}
                                error={errors.suffix}
                                showErrorMessage={false}
                            />
                            {errors.suffix && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.suffix}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="length_seq" className="text-right">
                                Length
                            </Label>
                            <Input
                                id="length_seq"
                                name="length_seq"
                                type="number"
                                placeholder="Length"
                                className="col-span-3"
                                min={1}
                                max={9}
                                required
                                onChange={(e) => setData("length_seq", Number(e.target.value))}
                                value={data.length_seq}
                                error={errors.length_seq}
                                showErrorMessage={false}
                            />
                            {errors.length_seq && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.length_seq}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="format_seq" className="text-right">
                                Format No.
                            </Label>
                            <Input
                                id="format_seq"
                                name="format_seq"
                                type="text"
                                placeholder="Format No."
                                className="col-span-3"
                                maxLength={255}
                                required
                                onChange={(e) => setData("format_seq", e.target.value)}
                                onBlur={() => generatePreviewNumber()}
                                value={data.format_seq}
                                error={errors.format_seq}
                                showErrorMessage={false}
                            />
                            <div className="col-start-2 col-span-3 space-x-1 text-muted-foreground text-xs">{previewFormatNumber}</div>
                            <div className="col-start-2 col-span-3 space-x-1">
                                {Object.entries(formatSeqArray).map((item) => (
                                    <Button key={item[0]} type="button" variant={"secondary"} onClick={() => handleButtonFormatNumber(String(item[1]))} size={"sm"}>
                                        {String(item[1])}
                                    </Button>
                                ))}
                            </div>
                            {errors.format_seq && <span className="text-xs text-red-600 dark:text-red-500 col-start-2 col-span-3">{errors.format_seq}</span>}
                        </div>
                    </div>
                    <DialogFooter className="justify-between">
                        <Button type="button" onClick={handleClose}>
                            <Cross2Icon className="mr-2 h-4 w-4" />
                            Close
                        </Button>
                        <Button type="submit" disabled={processing} variant={"outline"}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<FormDialogRef, FormDialogProps>(FormDialog);
