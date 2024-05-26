import { NextRequest, NextResponse } from 'next/server';

import Order from '@/models/Order';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';

export const GET = async (req: NextRequest, { params }: { params: { customerId: string } }) => {
    try {
        await connectToDB();

        const order = await Order.find({
            customerClerkId: params.customerId,
        }).populate({ path: 'products.product', model: Product });

        if (!order) {
            return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
                status: 404,
            });
        }

        return NextResponse.json(order, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error: any) {
        console.log('customerId_GET', error?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
