import MainMenu from "@/Components/MainMenu";
import { Button } from "@/Components/shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { Toaster } from "@/Components/shadcn/ui/sonner";
import { Group, Menu, PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { CircleUser } from "lucide-react";
import { DateTime } from "luxon";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";

export default function Authenticated({ children }: Readonly<PropsWithChildren>): ReactNode {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    /*** componenet state ***/
    const [groups, setGroups] = useState<Array<Group> | null>(null);
    const [menus, setMenus] = useState<Array<Menu> | null>(null);

    /*** effect ***/
    useEffect(() => {
        if (!groups) {
            retriveUserMenus();
        }
    }, [groups]);

    /*** events ***/
    if (!props.auth.user) {
        window.location.href = route("sign-in");
    }

    const retriveUserMenus = async () => {
        const getMenus = await axios.get(route("accesses.menu"));
        if (getMenus.status === 200) {
            setGroups(getMenus.data.data.groups);
            setMenus(getMenus.data.data.menus);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="w-full flex justify-between">
                    {/* Main navigation */}
                    <nav className="flex gap-6 text-lg font-medium items-center">
                        <Link href={route("/")} className="flex flex-shrink-0">
                            <img src={props.config.url + "/assets/images/logo.png"} className="h-8 w-auto" alt={props.app.web_name} />
                        </Link>
                        <MainMenu groups={groups} menus={menus} />
                    </nav>

                    {/* Account drop down */}
                    <div className="flex items-center gap-4">
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <OpenInNewWindowIcon className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href={route("profile.edit")}>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <Link href={route("sign-out")} method="post" as="button" className="w-full">
                                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>

            {/* Container main content */}
            <main className="flex flex-1 flex-col bg-gray-100">
                {children}
                <Toaster />
            </main>

            {/* Footer */}
            <section className="sticky bottom-0 border-t-1 shadow-md">
                <div className="flex w-full bg-white shadow-xl">
                    <div className="px-6 py-1 text-sm text-gray-500">{DateTime.now().setLocale(props.config.locale).toFormat("cccc, d MMMM y")}</div>
                </div>
            </section>
        </div>
    );
}
