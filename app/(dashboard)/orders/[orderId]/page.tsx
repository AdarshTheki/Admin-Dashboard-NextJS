import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/orderItem/OrderItemColumns';

const OrderDetail = async ({ params }: { params: { orderId: string } }) => {
    try {
        const res = await fetch(`/api/orders/${params.orderId}`);
        const { orderDetail, customer } = await res.json();
        let address: string[] = Object.values(orderDetail?.shippingAddress);

        return (
            <div className='flex flex-col gap-5 sm:px-8 px-2 py-10'>
                <p className='text-base-bold'>
                    Order ID: <span className='text-base-medium'>{orderDetail?._id}</span>
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
                    Total Paid:{' '}
                    <span className='text-base-medium'>${orderDetail?.totalAmount}</span>
                </p>
                <p className='text-base-bold'>
                    Shipping rate ID:{' '}
                    <span className='text-base-medium'>{orderDetail?.shippingRate}</span>
                </p>
                <DataTable columns={columns} data={orderDetail?.products} searchKey='product' />
            </div>
        );
    } catch (error: any) {
        console.error('Error fetching orders & customers details:', error?.message);
        return (
            <div className='sm:px-8 px-2 py-10 text-center'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Error</p>
                <p>Failed to load orders & customers details. Please try again later.</p>
            </div>
        );
    }
};

export const dynamic = 'force-dynamic';

export default OrderDetail;
