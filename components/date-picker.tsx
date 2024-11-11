"use client"

import {Calendar as CalendarIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {SelectSingleEventHandler} from "react-day-picker";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";

type DatePickerProps = {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
}

const DatePicker = (
    {
        value,
        onChange,
        disabled
    }: DatePickerProps) => {
    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon size={"4"} className={"mr-2"}/>
                    {value ? <span>{format(value, "PPP")}</span> : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode={"single"}
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus={true}
                />
            </PopoverContent>

        </Popover>
    );
};

export default DatePicker;