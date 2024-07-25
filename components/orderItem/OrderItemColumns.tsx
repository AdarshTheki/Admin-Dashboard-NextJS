'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<OrderItemType>[] = [
    {
        accessorKey: 'product',
        header: 'Product',
        cell: ({ row }) => {
            return (
                <Link
                    href={`/products/${row.original.product._id}`}
                    className='hover:text-blue-600 capitalize'>
                    {row.original.product.title}
                </Link>
            );
        },
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'quantity',
        header: 'Quantity',
    },
];
