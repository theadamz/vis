import { cn } from "@/Components/shadcn";
import { Button } from "@/Components/shadcn/ui/button";
import { Calendar } from "@/Components/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/shadcn/ui/popover";
import { dateJSFormat } from "@/utils/dateHandler";
import { Calendar as CalendarIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { ActiveModifiers, DateRange } from "react-day-picker";

type DatePickerProps = {
    className?: string;
    value?: DateRange;
    onClosed?: (date: DateRange | undefined) => void;
};

const DateRangePicker = ({ className, value, onClosed }: DatePickerProps): ReactNode => {
    const [date, setDate] = useState<DateRange | undefined>(value);
    const [dateTmp, setDateTmp] = useState<DateRange | undefined>(value);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isFromDateSelected, setIsFromDateSelected] = useState<boolean>(false);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

    useEffect(() => {
        if (onClosed && !isOpen && !isFirstLoad) {
            if (!date?.from || !date.to) {
                setDate(dateTmp);
                onClosed(dateTmp);
            } else {
                onClosed(date);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        setIsFirstLoad(false);
    }, []);

    useEffect(() => {
        setDate(value);
        setDateTmp(value);
    }, [value]);

    const handleSelectedDate = (range: DateRange | undefined, selectedDay: Date, activeModifiers: ActiveModifiers, e: React.MouseEvent) => {
        if (!isFromDateSelected) {
            setDateTmp(date);
            setDate({ from: selectedDay, to: undefined });
            setIsFromDateSelected(!isFromDateSelected);
        } else {
            setDate({ from: range?.from, to: selectedDay });
            setIsFromDateSelected(!isFromDateSelected);
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover onOpenChange={(open: boolean) => setIsOpen(open)} open={isOpen}>
                <PopoverTrigger asChild>
                    <Button id="date" variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal", className, !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from && date?.to ? (
                            <>
                                {dateJSFormat(date.from)} - {dateJSFormat(date.to)}
                            </>
                        ) : date?.from ? (
                            dateJSFormat(date.from)
                        ) : (
                            <span>Pick date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="range" defaultMonth={date?.from} selected={date} onSelect={handleSelectedDate} numberOfMonths={2} />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DateRangePicker;
