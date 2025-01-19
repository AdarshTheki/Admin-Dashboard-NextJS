'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';
import { columns } from '@/components/orders/OrderColumns';
import useFetch from '@/components/hook/useFetch';

const Orders: React.FC = () => {
    const { data, loading, error } = useFetch<OrderColumnType[]>('/api/orders');

    return loading || error ? (
        <Loader />
    ) : (
        <div className='sm:px-8 px-2 py-10'>
            <p className='sm:text-heading2-bold text-heading3-bold'>Orders</p>
            <Separator className='bg-grey-2 my-4' />
            <DataTable columns={columns} data={data || []} searchKey='_id' />
        </div>
    );
};

export default Orders;
