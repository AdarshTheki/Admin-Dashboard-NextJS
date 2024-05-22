'use client';

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import React, { useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
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
                        <CommandGroup
                            heading='Suggestions'
                            className=' max-h-[100px] overflow-auto'>
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
                        <Badge key={collection._id} className='font-light'>
                            {collection.title}
                            <span
                                className='ml-1 hover:text-red-1 cursor-pointer'
                                onClick={() => onRemove(collection._id)}>
                                <X className='h-4 w-4 font-extrabold' />
                            </span>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};
export default MultiSelect;
