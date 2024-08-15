import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from "@radix-ui/react-icons";

type CaretColumnProps = {
    sort: boolean | string;
};

export default function CaretColumn(props: Readonly<CaretColumnProps>): JSX.Element {
    if (!props.sort) {
        return <CaretSortIcon className="ml-2 h-4 w-4" />;
    }

    return props.sort === "asc" ? <ArrowUpIcon className="ml-2 h-4 w-4" /> : <ArrowDownIcon className="ml-2 h-4 w-4" />;
}
