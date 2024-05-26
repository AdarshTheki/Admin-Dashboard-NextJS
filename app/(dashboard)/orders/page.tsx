'use client';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';
import { columns } from '@/components/orders/OrderColumns';

const Orders = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const getOrders = async () => {
        try {
            const res = await fetch(`/api/orders`);
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.log('[orders_GET', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <div className='sm:px-10 px-2 py-5'>
            <p className='text-heading2-bold'>Orders</p>
            <Separator className='bg-grey-1 my-5' />
            <DataTable columns={columns} data={orders} searchKey='_id' />
        </div>
    );
};

export default Orders;
