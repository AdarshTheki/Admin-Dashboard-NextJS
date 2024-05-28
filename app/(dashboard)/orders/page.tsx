import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/orders/OrderColumns';

const Orders = async () => {
    try {
        const res = await fetch(`/api/orders`);
        const orders = await res.json();

        return (
            <div className='sm:px-8 px-2 py-10'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Orders</p>
                <Separator className='bg-grey-2 my-4' />
                <DataTable columns={columns} data={orders} searchKey='_id' />
            </div>
        );
    } catch (error: any) {
        console.error('Error fetching orders:', error?.message);
        return (
            <div className='sm:px-8 px-2 py-10 text-center'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Error</p>
                <p>Failed to load orders. Please try again later.</p>
            </div>
        );
    }
};

export const dynamic = 'force-dynamic';

export default Orders;
