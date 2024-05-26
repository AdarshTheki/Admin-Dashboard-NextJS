import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { connectToDB, header } from '@/lib/mongoDB';

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const orders = await Order.find().sort({ createdAt: 'desc' });

        const orderDetail = await Promise.all(
            orders.map(async (order) => {
                const customer = await Customer.findOne({ clerkId: order.customerClerkId });
                return {
                    _id: order._id,
                    customer: customer.name,
                    products: order.products.length,
                    totalAmount: order.totalAmount,
                    createdAt: format(order.createdAt, 'MMM dd, yyyy'),
                };
            })
        );

        return NextResponse.json(orderDetail, { status: 200, headers: header });
    } catch (error: any) {
        console.log('[orders_GET]', error?.message);
        return new NextResponse('Internal Sever Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
