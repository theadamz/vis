import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/Components/shadcn/ui/menubar";
import { Group, Menu } from "@/types";
import { Link } from "@inertiajs/react";
import _ from "lodash";
import { Fragment, ReactNode } from "react";
import IconDynamic from "./IconDynamic";

type MainMenuProps = {
    groups: Array<Group> | null;
    menus: Array<Menu> | null;
};

export default function MainMenu({ groups, menus }: Readonly<MainMenuProps>): ReactNode {
    if (!groups) return <div className="flex w-full text-nowrap">Mengambil menu...</div>;
    if (!menus) return <div className="flex w-full text-nowrap">Menu tidak ditemukan, hubungi administrator anda.</div>;

    return (
        <Menubar className="rounded-none shadow-none border-none">
            {groups.map((group, index) => {
                const dataMenus = _.pickBy(menus, (menu) => menu.group_code === group.code) as Array<Menu>;

                return (
                    <MenubarMenu key={group.code}>
                        <MenubarTrigger>{group.name}</MenubarTrigger>
                        {renderMenus(dataMenus)}
                    </MenubarMenu>
                );
            })}
        </Menubar>
    );
}

const renderMenus = (menus: Array<Menu>): ReactNode => {
    return (
        menus && (
            <MenubarContent>
                {_.map(menus, (menu, index) => {
                    return (
                        <Fragment key={`${menu.code}`}>
                            {menu.children ? (
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        <div className="flex w-full">
                                            <IconDynamic name={menu.icon} size={16} className="mr-2" />
                                            {menu.name}
                                        </div>
                                    </MenubarSubTrigger>
                                    {renderSubMenus(menu.children)}
                                </MenubarSub>
                            ) : (
                                <Link href={menu.path}>
                                    <MenubarItem className="flex w-full">
                                        <IconDynamic name={menu.icon} size={16} className="mr-2" />
                                        {menu.name}
                                    </MenubarItem>
                                </Link>
                            )}
                        </Fragment>
                    );
                })}
            </MenubarContent>
        )
    );
};

const renderSubMenus = (menus: Array<Menu>): ReactNode => {
    return (
        menus && (
            <MenubarSubContent>
                {_.map(menus, (menu) => {
                    return (
                        <Fragment key={`${menu.code}`}>
                            {menu.children ? (
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        <div className="flex w-full">
                                            <IconDynamic name={menu.icon} size={16} className="mr-2" />
                                            {menu.name}
                                        </div>
                                    </MenubarSubTrigger>
                                    {renderSubMenus(menu.children)}
                                </MenubarSub>
                            ) : (
                                <Link href={menu.path}>
                                    <MenubarItem className="flex w-full">
                                        <IconDynamic name={menu.icon} size={16} className="mr-2" />
                                        {menu.name}
                                    </MenubarItem>
                                </Link>
                            )}
                        </Fragment>
                    );
                })}
            </MenubarSubContent>
        )
    );
};
