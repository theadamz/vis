import { cn } from "@/Components/shadcn";
import { DialogContent, DialogHeader, Dialog as DialogRoot, DialogTitle } from "@/Components/shadcn/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface DialogRef {
    open: () => void;
    close: () => void;
}

type DialogProps = {
    className?: string | undefined;
    title: string | ReactNode;
    description?: string | ReactNode;
    children: ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
};

const Dialog = ({ className, title, description, children, onOpen, onClose }: DialogProps, ref: ForwardedRef<DialogRef>): ReactNode => {
    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: () => handleOpen(),
        close: () => handleClose(),
    }));

    /*** componenet state ***/
    const [open, setOpen] = useState<boolean>(false);

    /*** events ***/
    const handleOpen = () => {
        setOpen(true);
        onOpen && onOpen();
    };

    const handleClose = () => {
        setOpen(false);
        onClose && onClose();
    };

    return (
        <DialogRoot open={open}>
            <DialogContent className={cn(className)} aria-describedby="Form">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </DialogRoot>
    );
};

export default forwardRef<DialogRef, DialogProps>(Dialog);
