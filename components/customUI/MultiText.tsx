'use client';

import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface MultiTextProps {
    placeholder: string;
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({ placeholder, value, onChange, onRemove }) => {
    const [inputValue, setInputValue] = useState('');

    const addTags = (item: string) => {
        if (inputValue.trim() === '') return;
        onChange(item);
        setInputValue('');
    };
    return (
        <>
            <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addTags(inputValue);
                    }
                }}
            />

            <div className='flex flex-wrap gap-1 mt-4'>
                {value.map((tag, index) => (
                    <Badge key={index} className='bg-grey-1 font-medium text-sm text-white'>
                        {tag}
                        <span
                            onClick={() => onRemove(tag)}
                            className='ml-1 rounded-full outline-none hover:bg-red-1 cursor-pointer px-1 py-1'>
                            <X className='h-4 w-4' />
                        </span>
                    </Badge>
                ))}
            </div>
        </>
    );
};

export default MultiText;
