"use client"

import CreatableSelect from "react-select/creatable";
import {SingleValue} from "react-select";
import {useMemo} from "react";

type SelectProps = {
    onChange: (value?: string) => void;
    onCreate: (value: string) => void;
    options: { label: string, value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
}

const Select = (
    {
        value,
        onChange,
        onCreate,
        options,
        disabled,
        placeholder,
    }: SelectProps) => {


    const onSelect = (
        option: SingleValue<{ label: string, value: string }>
    ) => {
        onChange(option?.value);
    }

    const formattedValue = useMemo(() => {
        return options.find(option => option.value === value);
    }, [options, value]);


    return (
        <CreatableSelect
            placeholder={placeholder}
            className={"text-sm h-10"}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
            styles={{
                control: (base) => (
                    {
                        ...base,
                        borderColor: "#e2e8f0",
                        ":hover": {
                            borderColor: "#e2e8f0",
                        }
                    }
                )
            }}
        />
    );
};

export default Select;