'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import Delete from '../customUI/Delete';

export interface ProductDataProp {
    _id: string;
    title: string;
    collections: [CollectionType];
    thumbnail: string;
    price: number;
    discount: number;
    category: string;
}

export const columns: ColumnDef<ProductDataProp>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <Link
                href={`/products/${row.original?._id}`}
                className='hover:text-blue-600 capitalize'>
                {row.original.title}
            </Link>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'collections',
        header: 'Collections',
        cell: ({ row }) => row.original?.collections?.map((item) => item).join(', '),
    },
    {
        accessorKey: 'price',
        header: 'Price ($)',
        cell: ({ row }) => (
            <p>
                {row.original?.price?.toLocaleString('en-US', {
                    maximumFractionDigits: 1,
                    style: 'currency',
                    currency: 'USD',
                })}
            </p>
        ),
    },
    {
        accessorKey: 'discount',
        header: 'Discount (%)',
    },
    { id: 'actions', cell: ({ row }) => <Delete item='product' id={row.original._id} /> },
];
