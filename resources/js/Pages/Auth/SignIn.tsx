import { Button } from "@/Components/shadcn/ui/button";
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { PageProps } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

const SignIn = ({ canResetPassword, app, config }: PageProps<{ canResetPassword: boolean }>): JSX.Element => {
    const { data, setData, post, processing, errors, reset } = useForm<{ email: string; password: string; remember: boolean }>({
        email: "dev",
        password: "123456",
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e: React.FormEvent<Element>) => {
        e.preventDefault();

        post(route("sign-in"));
    };

    return (
        <>
            <Head title="Sign In" />

            <form onSubmit={submit}>
                <div className="w-full h-screen lg:grid lg:grid-cols-2">
                    <div className="hidden lg:block">
                        <img
                            alt="Logo"
                            src={config.url + "/assets/images/web-image.svg"}
                            width="1920"
                            height="1080"
                            className="h-full w-full object-contain p-10 dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                    <div className="flex items-center justify-center py-12">
                        <div className="mx-auto grid w-[350px] gap-6">
                            <div className="grid gap-2 text-center">
                                <h1 className="text-3xl font-bold">{app.web_name_short}</h1>
                                <p className="text-balance text-muted-foreground">{app.web_name}</p>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email / Username</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="me@email.com / myusername"
                                        required
                                        onChange={(e) => setData("email", e.target.value)}
                                        value={data.email}
                                        error={errors.email}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Kata Sandi</Label>
                                        {canResetPassword ? (
                                            <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                                                Lupa Kata Sandi?
                                            </Link>
                                        ) : null}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Kata Sandi"
                                        required
                                        onChange={(e) => setData("password", e.target.value)}
                                        value={data.password}
                                        error={errors.password}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData("remember", checked === "indeterminate" ? false : checked)}
                                        />
                                        <Label htmlFor="remember">Ingat Saya</Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Masuk
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Tidak memiliki akun?{" "}
                                <Link href={route("sign-up")} className="underline">
                                    Registrasi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

SignIn.layout = <GuestLayout />;

export default SignIn;
