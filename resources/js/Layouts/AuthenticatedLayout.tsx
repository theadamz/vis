import MainMenu from "@/Components/MainMenu";
import { Button } from "@/Components/shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/shadcn/ui/dropdown-menu";
import { Input } from "@/Components/shadcn/ui/input";
import { Toaster } from "@/Components/shadcn/ui/sonner";
import { Group, Menu, PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { CircleUser, Search } from "lucide-react";
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
                {/* Main navigation */}
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link href={route("/")} className="flex flex-shrink-0">
                        <img src={props.config.url + "/assets/images/logo.png"} className="h-8 w-auto" alt={props.app.web_name} />
                    </Link>
                    <MainMenu groups={groups} menus={menus} />
                </nav>

                {/* Account drop down */}
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Pencarian..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={route("profile.edit")}>
                                <DropdownMenuItem>Profil</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Riwayat</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href={route("sign-out")} method="post" as="button" className="w-full">
                                <DropdownMenuItem>Keluar</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            {/* Container main content */}
            <main className="flex flex-1 flex-col bg-gray-100">
                {children}
                <Toaster />
            </main>

            {/* Footer */}
            <header className="sticky bottom-0 border-t-1 shadow-md">
                <div className="flex w-full bg-white shadow-xl">
                    <div className="px-6 py-1 text-sm text-gray-500">{DateTime.now().setLocale(props.config.locale).toFormat("cccc, d MMMM y")}</div>
                </div>
            </header>
        </div>
    );
}
