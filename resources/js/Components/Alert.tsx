import { Alert as AlertContainer, AlertDescription, AlertTitle } from "@/Components/shadcn/ui/alert";
import { Fragment, ReactNode } from "react";
import IconDynamic from "./IconDynamic";

type AlertProps = {
    variant?: "default" | "destructive";
    icon?: string | ReactNode;
    title: string | ReactNode;
    message: string | ReactNode;
};

export default function Alert({ variant = "default", icon, title, message }: Readonly<AlertProps>): JSX.Element {
    return (
        <AlertContainer variant={variant} className="">
            {icon && typeof icon === "string" ? <IconDynamic name={icon} className="h-4 w-4" /> : <Fragment>{icon}</Fragment>}
            {title && typeof title === "string" ? <AlertTitle>{title}</AlertTitle> : <Fragment>{title}</Fragment>}
            <AlertDescription>{message}</AlertDescription>
        </AlertContainer>
    );
}
