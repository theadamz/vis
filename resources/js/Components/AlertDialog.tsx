import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialog as AlertDialogRoot,
    AlertDialogTitle,
} from "@/Components/shadcn/ui/alert-dialog";
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export interface AlertDialogRef {
    open: (props?: AlertDialogProps) => void;
    close: () => void;
}

type Props = {
    onClose?: (result: boolean) => void;
};

type AlertDialogProps = {
    title?: string | ReactNode;
    description?: string | ReactNode;
};

const AlertDialog = (props: Props, ref: ForwardedRef<AlertDialogRef>): ReactNode => {
    /*** componenet state ***/
    const [open, setOpen] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertDialogProps>();

    /*** imperative ***/
    useImperativeHandle(ref, () => ({
        open: (props?: AlertDialogProps) => handleOpen(props),
        close: () => handleClose(),
    }));

    /*** events ***/
    const handleOpen = (props?: AlertDialogProps) => {
        setAlert({
            title: props?.title ?? "Confirmation",
            description: props?.description ?? "Are you sure?",
        });

        setOpen(true);
    };

    const handleSelected = (result: boolean) => {
        setOpen(false);
        if (props.onClose) {
            props.onClose(result);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <AlertDialogRoot open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
                    <AlertDialogDescription>{alert?.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => handleSelected(true)}>Yes</AlertDialogAction>
                    <AlertDialogCancel onClick={() => handleSelected(false)}>No</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogRoot>
    );
};

export default forwardRef<AlertDialogRef, Props>(AlertDialog);
