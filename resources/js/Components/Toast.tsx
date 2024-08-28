import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Check, Info } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";

type ToastProps = {
    variant?: "default" | "warning" | "danger" | "success";
    title?: string;
    description: string | ReactNode;
};

const Toast = ({ variant = "default", title = "Warning", description }: ToastProps) => {
    switch (variant) {
        case "warning":
            toast(
                <div className="flex">
                    <ExclamationTriangleIcon className="h-6 w-6 mr-2" color="#f6b100" />
                    <div className="flex flex-col">
                        {title && <span className="text-warning font-bold">{title}</span>}
                        <div className="flex flex-col text-warning">{description}</div>
                    </div>
                </div>
            );
            break;

        case "danger":
            toast(
                <div className="flex">
                    <Check className="h-6 w-6 mr-2" color="#f8285a" />
                    <div className="flex flex-col">
                        {title && <span className="text-danger font-bold">{title}</span>}
                        <div className="flex flex-col text-danger">{description}</div>
                    </div>
                </div>
            );
            break;

        case "success":
            toast(
                <div className="flex">
                    <Check className="h-6 w-6 mr-2" color="#17c653" />
                    <div className="flex flex-col">
                        {title && <span className="text-success font-bold">{title}</span>}
                        <div className="flex flex-col text-success">{description}</div>
                    </div>
                </div>
            );
            break;

        default:
            toast(
                <div className="flex">
                    <Info className="h-6 w-6 mr-2" />
                    <div className="flex flex-col">
                        {title && <span className="font-bold">{title}</span>}
                        <div className="flex flex-col">{description}</div>
                    </div>
                </div>
            );
            break;
    }
};

export default Toast;
