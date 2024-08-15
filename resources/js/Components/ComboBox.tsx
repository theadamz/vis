import { cn } from "@/Components/shadcn";
import { Button } from "@/Components/shadcn/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcn/ui/popover";
import _ from "lodash";
import { Check, ChevronsUpDown } from "lucide-react";
import { Fragment, ReactNode, useEffect, useState } from "react";

type Option = {
    value: string;
    label: string;
};

type ComboBoxProps = {
    className?: string;
    placeholder?: string;
    defOpen?: boolean;
    items: Array<Option>;
    filterItemKey?: "value" | "label";
    defValue?: string;
    onValueChange?: (value: string) => void;
    error?: string;
    showErrorMessage?: boolean;
};

const ComboBox = ({
    className,
    placeholder = "Select",
    defOpen = false,
    items,
    filterItemKey = "label",
    defValue = "",
    onValueChange,
    error,
    showErrorMessage = true,
}: ComboBoxProps): ReactNode => {
    const [open, setOpen] = useState(defOpen);
    const [value, setValue] = useState(defValue);

    useEffect(() => {
        setValue(defValue);
    }, [defValue]);

    return (
        <Fragment>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" aria-expanded={open} className={cn("p-3.5 justify-between", className, error ? "border-red-500" : "")}>
                        {value ? items.find((item) => item.value === value)?.label : placeholder}
                        <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("p-0", className)}>
                    <Command
                        filter={(value: string, search: string) => {
                            if (filterItemKey === "value") {
                                return _.startsWith(value, search) ? 1 : 0;
                            } else {
                                const filters = _.transform(
                                    items,
                                    (result: string[], value, key) => {
                                        if (value.label.toLowerCase().includes(search.toLowerCase())) {
                                            result.push(value.value);
                                        }
                                    },
                                    []
                                );

                                return filters.includes(value) ? 1 : 0;
                            }
                        }}
                    >
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>Not found.</CommandEmpty>
                            <CommandGroup className="p-0 w-full">
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            onValueChange && onValueChange(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && showErrorMessage && <span className="text-xs text-red-600 dark:text-red-500">{error}</span>}
        </Fragment>
    );
};

export default ComboBox;
