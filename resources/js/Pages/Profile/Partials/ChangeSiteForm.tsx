import ComboBox from "@/Components/ComboBox";
import { Button } from "@/Components/shadcn/ui/button";
import { Site } from "@/types";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { CheckIcon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler } from "react";

export default function ChangeSiteForm({ className = "", sites }: Readonly<{ className?: string; sites: Site[] }>) {
    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
        site: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("profile.update.site"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Change Site</h2>
                <p className="mt-1 text-sm text-gray-600">Change your default site.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="grid grid-cols-12 gap-4">
                    <div className="grid col-span-4 gap-2">
                        <ComboBox
                            className="w-96"
                            placeholder="Filter Site"
                            defValue={data.site}
                            items={sites.map((site) => {
                                return { value: site.id!, label: site.name };
                            })}
                            onValueChange={(value) => setData("site", value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin stroke-white" /> : <CheckIcon className="mr-2 h-4 w-4 stroke-white" />}
                        Save
                    </Button>

                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
