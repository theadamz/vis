import { PropsWithChildren } from "react";

export default function Guest({ children }: Readonly<PropsWithChildren>) {
    return <div className="min-h-screen">{children}</div>;
}
