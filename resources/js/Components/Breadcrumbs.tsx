import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/shadcn/ui/breadcrumb";
import { Link } from "@inertiajs/react";
import { Fragment, ReactNode } from "react";

type BreadcrumbProps = {
    items: Array<{
        label: string;
        link?: string;
    }>;
};

const Breadcrumbs = ({ items }: BreadcrumbProps): ReactNode => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => {
                    if (item.link) {
                        return (
                            <Fragment key={item.label}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild className="text-xs font-medium leading-none text-gray-400">
                                        <Link href={item.link}>{item.label}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {index < items.length - 1 && items.length > 1 ? <BreadcrumbSeparator /> : null}
                            </Fragment>
                        );
                    } else {
                        return (
                            <Fragment key={item.label}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-xs font-medium leading-none text-gray-400">{item.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                                {index < items.length - 1 && items.length > 1 ? <BreadcrumbSeparator /> : null}
                            </Fragment>
                        );
                    }
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;
