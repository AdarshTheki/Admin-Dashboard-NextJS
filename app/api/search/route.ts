import { NextRequest, NextResponse } from 'next/server';

import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { corsHeader } from '@/lib/constant';

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q') || '';

    try {
        await connectToDB();

        const searchQuery = {
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { tags: { $in: [q] } }, // Ensure `q` is in an array for `$in`
            ],
        };

        const searchProducts = await Product.find(searchQuery, {
            _id: 1,
            title: 1,
            thumbnail: 1,
            category: 1,
            price: 1,
        })
            .sort({ updatedAt: -1 })
            .limit(10);

        return NextResponse.json(searchProducts, { status: 200, headers: corsHeader });
    } catch (error: any) {
        console.log('[search_GET]', error.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500 }
        );
    }
};

export const dynamic = 'force-dynamic';
