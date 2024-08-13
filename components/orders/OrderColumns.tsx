'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<OrderColumnType>[] = [
    // {
    //     accessorKey: '_id',
    //     header: 'Order',
    //     cell: ({ row }) => {
    //         return (
    //             <Link href={`/orders/${row.original._id}`} className='hover:text-blue-600'>
    //                 {row.original._id}
    //             </Link>
    //         );
    //     },
    // },
    {
        accessorKey: '_id',
        header: 'Customer',
        cell: ({ row }) => {
            return (
                <Link href={`/orders/${row.original?._id}`} className='hover:text-blue-600'>
                    {row.original?.customer}
                </Link>
            );
        },
    },
    {
        accessorKey: 'products',
        header: 'Count',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total ($)',
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
    },
];
