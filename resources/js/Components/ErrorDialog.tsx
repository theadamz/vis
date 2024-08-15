import { Button } from "@/Components/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { ScrollArea } from "@/Components/shadcn/ui/scroll-area";
import Toast from "@/Components/Toast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface ErrorDialogRef {
    show: (props: ErrorDialogProps) => void;
    close: () => void;
}

type Props = {};

type ErrorDialogProps = {
    title?: string;
    description?: string;
    message?: string | ReactNode;
};

const ErrorDialog = (props: Props, ref: ForwardedRef<ErrorDialogRef>): ReactNode => {
    /*** componenet state ***/
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<ErrorDialogProps>();

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        show: (props: ErrorDialogProps) => handleOpen(props),
        close: () => handleClose(),
    }));

    /*** events ***/
    const handleOpen = (props: ErrorDialogProps) => {
        setError({
            title: props.title ?? "Error",
            description: props.description ?? "Error has been occurred, see below to know more.",
            message: props.message ?? "No message available.",
        });

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(!open);
    };

    const handleCopy = async () => {
        if (error?.message !== undefined && typeof error.message === "string") {
            await navigator.clipboard.writeText(error.message);
            Toast({ variant: "default", title: "Info", description: "Copy Success" });
        } else {
            Toast({ variant: "default", title: "Info", description: "Cannot copy, please contact your administrator." });
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent className="w-1/2">
                <DialogHeader>
                    <DialogTitle>{error ? error.title : ""}</DialogTitle>
                    <DialogDescription>{error ? error.description : ""}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full h-96 bg-secondary rounded-md p-1">
                    <div className="flex flex-col text-sm text-danger">{error ? error.message : ""}</div>
                </ScrollArea>
                <DialogFooter className="flex justify-between">
                    <DialogTrigger asChild>
                        <Button type="button" variant={"secondary"} onClick={handleClose}>
                            Close
                        </Button>
                    </DialogTrigger>
                    <Button type="button" onClick={handleCopy}>
                        Copy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef<ErrorDialogRef, Props>(ErrorDialog);
