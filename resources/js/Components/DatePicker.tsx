import { cn } from "@/Components/shadcn";
import { Button } from "@/Components/shadcn/ui/button";
import { Calendar } from "@/Components/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcn/ui/popover";
import { dateJSFormat } from "@/utils/dateHandler";
import { Calendar as CalendarIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

type DatePickerProps = {
    className?: string;
    value?: Date;
    closeOnSelect?: boolean;
    onSelected?: (date: Date) => void;
};

const DatePicker = ({ className, value = new Date(), closeOnSelect = true, onSelected }: DatePickerProps): ReactNode => {
    const [date, setDate] = useState<Date | undefined>(value);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        onSelected && date && onSelected(date);
        closeOnSelect && isOpen && setIsOpen(false);
    }, [date]);

    useEffect(() => {
        setDate(value);
    }, [value]);

    return (
        <Popover onOpenChange={(open: boolean) => setIsOpen(open)} open={isOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", className, !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? dateJSFormat(date) : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
