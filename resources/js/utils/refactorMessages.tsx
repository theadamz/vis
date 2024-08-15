import { ReactNode } from "react";

export const refactorErrorMessage = (errors: { [key: string]: string }): string | ReactNode => {
    const message = Object.entries(errors).map((item) => {
        return (
            <span key={item[0]}>
                {item[0]}: {item[1]}
            </span>
        );
    });

    return message;
};
