import Breadcrumbs from "@/Components/Breadcrumbs";
import { Separator } from "@/Components/shadcn/ui/separator";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";

const Dashboard = ({ auth }: PageProps): JSX.Element => {
    return (
        <>
            <Head title="Dashboard" />
            {/* sub header */}
            <header className="sticky top-16 w-full flex py-2 px-6 bg-white shadow">
                <div className="flex space-x-2 items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Dashboard</div>
                    <Separator orientation="vertical" />
                    <Breadcrumbs items={[{ label: "Dashboard" }]} />
                </div>
            </header>

            {/* main content */}
            <section className="p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">This is dashboard page</div>
                        <div className="text-center pb-6">Welcome Back! {auth.user.name}</div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Dashboard;
