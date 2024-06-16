'use client';

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';

interface MultiSelectProps {
    placeholder: string;
    collections: CollectionType[];
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    placeholder,
    collections,
    value,
    onChange,
    onRemove,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);

    const selected = useMemo(() => {
        return value
            .map((id) => collections.find((collection) => collection._id === id))
            .filter(Boolean) as CollectionType[];
    }, [value, collections]);

    const selectables = useMemo(() => {
        return collections.filter((collection) => !selected.includes(collection));
    }, [collections, selected]);

    return (
        <div className='sm:flex gap-5 items-start'>
            <Command className='max-w-[200px]'>
                <CommandInput
                    placeholder={placeholder}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                />

                <CommandList>
                    {open && selectables.length !== 0 && (
                        <CommandGroup heading='Suggestions' className='max-h-[300px] overflow-auto'>
                            {selectables.map((item) => (
                                <CommandItem
                                    key={item._id}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onChange(item._id);
                                        setInputValue('');
                                    }}
                                    className='hover:bg-grey-2 cursor-pointer'>
                                    {item.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>

            {selected.length !== 0 && (
                <div className='flex flex-wrap gap-2'>
                    {selected.map((collection) => (
                        <p
                            key={collection._id}
                            className='py-1 px-2 bg-blue-1 capitalize text-small-medium flex items-center rounded-lg text-white'>
                            {collection.title?.toLowerCase()}
                            <span
                                className='ml-1 rounded-full outline-none hover:bg-red-1 cursor-pointer px-1 py-1'
                                onClick={() => onRemove(collection._id)}>
                                <X className='h-4 w-4' />
                            </span>
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};
export default MultiSelect;
