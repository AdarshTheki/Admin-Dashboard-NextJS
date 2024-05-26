import { NextRequest, NextResponse } from 'next/server';

import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';

export const GET = async (req: NextRequest, { params }: { params: { query: string } }) => {
    try {
        await connectToDB();

        const searchProducts = await Product.find({
            $or: [
                { title: { $regex: params.query, $options: 'i' } },
                { category: { $regex: params.query, $options: 'i' } },
                { tags: { $in: [new RegExp(params.query, 'i')] } }, // $in used in array to match values
            ],
        });

        return NextResponse.json(searchProducts, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error: any) {
        console.log('[searchQuery_GET]', error.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
