import Customer from '@/models/Customer';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { connectToDB, header } from '@/lib/mongoDB';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
    try {
        await connectToDB();

        const orderDetail = await Order.findById(params.orderId).populate({
            path: 'products.product',
            model: Product,
        });
        if (!orderDetail) {
            return new NextResponse(JSON.stringify({ message: 'Order Not Found' }), {
                status: 400,
            });
        }

        const customer = await Customer.findOne({ clerkId: orderDetail.customerClerkId });

        return NextResponse.json({ orderDetail, customer }, { status: 200, headers: header });
    } catch (error: any) {
        console.log('[orderId_GET]', error?.message);
        return new NextResponse('Internal Sever Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
