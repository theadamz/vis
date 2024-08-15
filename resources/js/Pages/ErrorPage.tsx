import { Button } from "@/Components/shadcn/ui/button";
import { PageProps } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { ArrowLeftIcon, HomeIcon } from "@radix-ui/react-icons";
import { HttpStatusCode } from "axios";

type ErrorPageProps = {
    status: number;
    message: string;
};

export default function ErrorPage({ status, message }: Readonly<ErrorPageProps>): JSX.Element {
    const props = usePage<PageProps>().props;

    return (
        <>
            <Head title={`${status}: ${HttpStatusCode[status]}`} />
            <div className="bg-white w-auto m-auto rounded-md p-4 shadow-md">
                <span className="text-4xl font-bold text-center">
                    {status}: {HttpStatusCode[status]}
                </span>
                <div className="p-4 my-4 text-center bg-secondary">{message}</div>
                <div className="flex justify-between mt-5">
                    <Button onClick={() => props.prev_url && router.visit(props.prev_url)}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => router.visit(props.auth.user.def_path)} variant={"outline"}>
                        <HomeIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}
