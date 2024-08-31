import { Button } from "@/Components/shadcn/ui/button";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { PageProps } from "@/types";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { CheckIcon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler } from "react";

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = "" }: Readonly<{ mustVerifyEmail: boolean; status?: string; className?: string }>) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        username: user.username,
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">Update your account's profile information and email address.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid grid-cols-12 gap-4">
                    <div className="grid col-span-4 gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            maxLength={255}
                            onChange={(e) => setData("username", e.target.value)}
                            value={data.username}
                            error={errors.username}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="grid col-span-4 gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            maxLength={255}
                            onChange={(e) => setData("name", e.target.value)}
                            value={data.name}
                            error={errors.name}
                            required
                        />
                    </div>
                    <div className="grid col-span-4 gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            maxLength={255}
                            onChange={(e) => setData("email", e.target.value)}
                            value={data.email}
                            error={errors.email}
                            required
                        />
                    </div>
                </div>

                {mustVerifyEmail && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">A new verification link has been sent to your email address.</div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin stroke-white" /> : <CheckIcon className="mr-2 h-4 w-4 stroke-white" />}
                        Save
                    </Button>

                    {/* message */}
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
