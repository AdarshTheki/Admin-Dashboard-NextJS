'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import Delete from '../customUI/Delete';

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <Link href={`/products/${row.original._id}`} className='hover:text-blue-1 capitalize'>
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
        cell: ({ row }) => row.original.collections.map((item) => item.title).join(', '),
    },
    {
        accessorKey: 'price',
        header: 'Price (Rs)',
        cell: ({ row }) => (
            <p>
                {row.original?.price?.toLocaleString('en-IN', {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                })}
            </p>
        ),
    },
    {
        accessorKey: 'expense',
        header: 'Expense (Rs)',
        cell: ({ row }) => (
            <p>
                {row.original?.expense?.toLocaleString('en-IN', {
                    maximumFractionDigits: 0,
                    style: 'currency',
                    currency: 'INR',
                })}
            </p>
        ),
    },
    { id: 'actions', cell: ({ row }) => <Delete item='product' id={row.original._id} /> },
];
