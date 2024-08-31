import { Button } from "@/Components/shadcn/ui/button";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { CheckIcon, UpdateIcon } from "@radix-ui/react-icons";
import { FormEventHandler, useRef } from "react";

export default function UpdatePasswordForm({ className = "" }: { className?: string }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="grid grid-cols-12 gap-4">
                    <div className="grid col-span-4 gap-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input
                            id="current_password"
                            name="current_password"
                            type="password"
                            placeholder="Current Password"
                            maxLength={255}
                            onChange={(e) => setData("current_password", e.target.value)}
                            value={data.current_password}
                            error={errors.current_password}
                            ref={currentPasswordInput}
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="grid col-span-4 gap-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="New Password"
                            maxLength={255}
                            onChange={(e) => setData("password", e.target.value)}
                            value={data.password}
                            error={errors.password}
                            ref={passwordInput}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="grid col-span-4 gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirm Password"
                            maxLength={255}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            value={data.password_confirmation}
                            error={errors.password_confirmation}
                            autoComplete="new-password"
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
