"use client"

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {Info, MinusCircle, Plus} from "lucide-react";
import CurrencyInput from "react-currency-input-field";


type AmountInputProps = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}

const AmountInput = (
    {
        value,
        onChange,
        placeholder,
        disabled,
    }: AmountInputProps) => {
    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    console.log("value", value)


    const onReverseValue = () => {
        if (!value) return;
        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    }

    return (
        <div className={"relative"}>
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            type={"button"}
                            onClick={onReverseValue}
                            className={cn(
                                "p-2 flex items-center justify-center absolute top-1.5 left-1.5 rounded-md bg-slate-400 hover:bg-slate-500",
                                isExpense && "bg-red-400 hover:bg-red-500"
                            )}
                        >
                            {!parsedValue && <Info className={"size-3 text-white"}/>}
                            {isIncome && <Plus className={"size-3 text-white"}/>}
                            {isExpense && <MinusCircle className={"size-3 text-white"}/>}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Use [+] for income and [-] for expenses
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix={"$"}
                className={"flex h-10 w-full rounded-md border border-input bg-transparent px-5 pl-10 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
            />
            <p className={"text-xs text-muted-foreground mt-2"}>
                {isIncome && <span>This will count as an income</span>}
                {isExpense && <span>This will count as an expense</span>}
            </p>
        </div>
    );
};

export default AmountInput;