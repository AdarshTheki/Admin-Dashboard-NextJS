'use client';

import React, { useEffect, useState } from 'react';

import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/orderItem/OrderItemColumns';
import Loader from '@/components/customUI/Loader';

const OrderDetail = ({ params }: { params: { orderId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<any>({});
    const [customer, setCustomer] = useState<any>({});

    const getOrderDetails = async () => {
        try {
            const res = await fetch(`/api/orders/${params.orderId}`);
            const data = await res.json();
            setOrderDetails(data.orderDetail);
            setCustomer(data.customer);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrderDetails();
    }, []);

    if (loading) return <Loader />;

    let address: string[] = Object.values(orderDetails?.shippingAddress);

    return (
        <div className='flex flex-col gap-5 sm:px-8 px-2 py-10'>
            <p className='text-base-bold'>
                Order ID: <span className='text-base-medium'>{orderDetails._id}</span>
            </p>
            <p className='text-base-bold'>
                Customer name: <span className='text-base-medium'>{customer?.name}</span>
            </p>
            <p className='text-base-bold'>
                Shipping address:{' '}
                <span className='text-base-medium capitalize'>
                    {address.map((i) => i?.toLowerCase()).join(', ')}
                </span>
            </p>
            <p className='text-base-bold'>
                Total Paid: <span className='text-base-medium'>${orderDetails.totalAmount}</span>
            </p>
            <p className='text-base-bold'>
                Shipping rate ID:{' '}
                <span className='text-base-medium'>{orderDetails.shippingRate}</span>
            </p>
            <DataTable columns={columns} data={orderDetails.products} searchKey='product' />
        </div>
    );
};

export default OrderDetail;
