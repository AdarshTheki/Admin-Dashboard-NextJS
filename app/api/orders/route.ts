import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { connectToDB } from '@/lib/mongoDB';
import { corsHeader } from '@/lib/constant';

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const orders = await Order.find().sort({ createdAt: -1 });

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

        return NextResponse.json(orderDetail, { status: 200, headers: corsHeader });
    } catch (error: any) {
        console.log('[orders_GET]', error?.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500 }
        );
    }
};

export const dynamic = 'force-dynamic';
