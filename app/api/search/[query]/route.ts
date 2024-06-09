import { NextRequest, NextResponse } from 'next/server';

import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { corsHeader } from '@/lib/constant';

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

        return NextResponse.json(searchProducts, { status: 200, headers: corsHeader });
    } catch (error: any) {
        console.log('[searchQuery_GET]', error.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500 }
        );
    }
};

export const dynamic = 'force-dynamic';
