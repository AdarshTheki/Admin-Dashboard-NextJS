'use client';

import React from 'react';

import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/orderItem/OrderItemColumns';
import Loader from '@/components/customUI/Loader';
import useFetch from '@/components/hook/useFetch';

interface DataProps {
    orderDetail: OrderType;
    customer: CustomerType;
}

interface OrderDetailProps {
    params: { orderId: string };
}

const OrderDetail: React.FC<OrderDetailProps> = ({ params }) => {
    const { data, loading, error } = useFetch<DataProps>(`/api/orders/${params.orderId}`);

    if (loading || error) return <Loader />;

    return (
        <div className='flex flex-col gap-5 sm:px-8 px-2 py-10'>
            <p className='text-base-bold'>
                Order ID: <span className='text-base-medium'>{data?.orderDetail._id}</span>
            </p>
            <p className='text-base-bold'>
                Customer name: <span className='text-base-medium'>{data?.customer.name}</span>
            </p>
            <p className='text-base-bold'>
                Shipping address:{' '}
                <span className='text-base-medium capitalize'>
                    {Object.values(data?.orderDetail.shippingAddress || {})
                        .map((i) => i)
                        .join(', ')}
                </span>
            </p>
            <p className='text-base-bold'>
                Total Paid:{' '}
                <span className='text-base-medium'>${data?.orderDetail.totalAmount}</span>
            </p>
            <p className='text-base-bold'>
                Shipping rate ID:{' '}
                <span className='text-base-medium'>{data?.orderDetail.shippingRate}</span>
            </p>
            <DataTable
                columns={columns}
                data={data?.orderDetail.products || []}
                searchKey='product'
            />
        </div>
    );
};

export default OrderDetail;
