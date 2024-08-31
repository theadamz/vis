import { PageProps, Site } from "@/types";
import { Head } from "@inertiajs/react";
import ChangeSiteForm from "./Partials/ChangeSiteForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

const Edit = ({ mustVerifyEmail, status, sites }: PageProps<{ mustVerifyEmail: boolean; status?: string; sites: Site[] }>) => {
    return (
        <>
            <Head title="Profile" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Profile</div>
                </div>
            </header>

            <div className="p-4 mx-auto space-y-6 w-full">
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <ChangeSiteForm className="w-full" sites={sites} />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="w-full" />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <UpdatePasswordForm className="w-full" />
                </div>
            </div>
        </>
    );
};

export default Edit;
