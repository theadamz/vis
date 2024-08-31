import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button } from "@/Components/shadcn/ui/button";
import { Label } from "@/Components/shadcn/ui/label";
import { Separator } from "@/Components/shadcn/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/shadcn/ui/table";
import { PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

type reportList = {
    name: string;
    description: string;
    path: string;
};

const Index = ({ reportLists }: PageProps<{ reportLists: reportList[] }>): JSX.Element => {
    /*** inertia js ***/
    const props = usePage<PageProps>().props;

    return (
        <>
            <Head title="Reports" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Reports</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Reports" }]} />
                </div>
            </header>

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="w-full over mt-5">
                        {reportLists.length <= 0 ? (
                            <div className="w-full py-5 text-center">
                                <Label>No report found, please contact your administrator.</Label>
                            </div>
                        ) : (
                            <Table className="rounded-sm border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-auto">Name</TableHead>
                                        <TableHead className="w-auto">Description</TableHead>
                                        <TableHead className="w-[40px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportLists.map((report) => (
                                        <TableRow key={report.name}>
                                            <TableCell>{report.name}</TableCell>
                                            <TableCell>{report.description}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={report.path}>
                                                    <Button variant="outline" size="icon">
                                                        <ArrowRightIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
