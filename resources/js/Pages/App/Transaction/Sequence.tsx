import Breadcrumbs from "@/Components/Breadcrumbs";
import ComboBox from "@/Components/ComboBox";
import { TransactionSequenceColumns } from "@/Components/datatables/columns/TransactionSequenceColumns";
import DataTablePagination, { DataTableRef } from "@/Components/datatables/DataTablePagination";
import Select from "@/Components/Select";
import { Button } from "@/Components/shadcn/ui/button";
import { Separator } from "@/Components/shadcn/ui/separator";
import { PageProps, Site, TransactionType } from "@/types";
import { ITransactionTypeDataTablePagination } from "@/types/datatables";
import { Head } from "@inertiajs/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";

const Index = ({
    datatable,
    transactionTypes,
    sites,
}: PageProps<{ datatable: ITransactionTypeDataTablePagination; transactionTypes: TransactionType[]; sites: Site[] }>): JSX.Element => {
    /*** references ***/
    const dataTable = useRef<DataTableRef>(null);

    /*** componenet state ***/
    const [queryStrings, setQueryStrings] = useState<{ [field: string]: any } | undefined>(undefined);

    /*** effect ***/
    useEffect(() => {
        if (queryStrings !== undefined) {
            dataTable.current?.refresh();
        }
    }, [queryStrings]);

    /*** events ***/
    const handleFilters = (field: string, value: any) => {
        setQueryStrings({
            ...queryStrings,
            ...{ [field]: value },
        });
    };

    const handleFilterClear = () => {
        setQueryStrings(undefined);
        dataTable.current?.resetFilters();
    };

    return (
        <>
            <Head title="Nomor Urutan" />
            {/* sub header */}
            <header className="sticky top-16 z-10 w-full flex items-center px-6 bg-white shadow justify-between h-14">
                <div className="items-center">
                    <div className="font-semibold text-md leading-tight text-gray-800">Nomor Urutan</div>
                    <Separator className="my-1" />
                    <Breadcrumbs items={[{ label: "Aplikasi" }, { label: "Transaksi" }, { label: "Nomor Urutan" }]} />
                </div>
            </header>

            {/* main content */}
            <section className="p-4">
                <div className="p-4 bg-white shadow-sm rounded-lg">
                    <div className="flex space-x-2">
                        <Select
                            className="w-[180px]"
                            placeholder="Filter Trans. Type"
                            selectLabel="Filter Trans. Type"
                            value={queryStrings ? queryStrings["transaction_type"] : ""}
                            onValueChange={(value) => handleFilters("transaction_type", value)}
                            items={transactionTypes.map((item) => {
                                return { value: item.id!, label: `${item.code} - ${item.name}` };
                            })}
                        />
                        <ComboBox
                            className="w-[250px]"
                            placeholder="Filter Site"
                            defValue={queryStrings ? queryStrings["site"] : ""}
                            items={sites.map((site) => {
                                return { value: site.id!, label: site.name };
                            })}
                            onValueChange={(value) => handleFilters("site", value)}
                        />
                        {queryStrings && (
                            <Button aria-label="Reset filters" variant="ghost" className="px-2 lg:px-3" onClick={() => handleFilterClear()}>
                                Reset Filters
                                <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-row">
                        <DataTablePagination
                            ref={dataTable}
                            columnDefs={TransactionSequenceColumns}
                            data={datatable}
                            containerClass="rounded-sm border"
                            scrollAreaClass="h-96"
                            additionalQueryStrings={queryStrings}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
