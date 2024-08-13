'use client';

import React, { useEffect, useState } from 'react';

import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/orderItem/OrderItemColumns';
import Loader from '@/components/customUI/Loader';

const OrderDetail = ({ params }: { params: { orderId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({});

    const getOrderDetails = async () => {
        try {
            const res = await fetch(`/api/orders/${params.orderId}`);
            if (!res.ok) {
                throw new Error('order detail not found');
                return;
            }
            const order = await res.json();
            setData(order);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrderDetails();
    }, []);

    const { orderDetail, customer } = data;

    if (loading) return <Loader />;

    return (
        <div className='flex flex-col gap-5 sm:px-8 px-2 py-10'>
            <p className='text-base-bold'>
                Order ID: <span className='text-base-medium'>{orderDetail._id}</span>
            </p>
            <p className='text-base-bold'>
                Customer name: <span className='text-base-medium'>{customer?.name}</span>
            </p>
            <p className='text-base-bold'>
                Shipping address:{' '}
                <span className='text-base-medium capitalize'>
                    {Object.values(orderDetail?.shippingAddress)
                        .map((i) => i)
                        .join(', ')}
                </span>
            </p>
            <p className='text-base-bold'>
                Total Paid: <span className='text-base-medium'>${orderDetail?.totalAmount}</span>
            </p>
            <p className='text-base-bold'>
                Shipping rate ID:{' '}
                <span className='text-base-medium'>{orderDetail?.shippingRate}</span>
            </p>
            <DataTable columns={columns} data={orderDetail?.products} searchKey='product' />
        </div>
    );
};

export default OrderDetail;
