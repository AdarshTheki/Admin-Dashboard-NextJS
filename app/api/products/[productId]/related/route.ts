import { NextRequest, NextResponse } from 'next/server';

import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { corsHeader } from '@/lib/constant';

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connectToDB();

        const product = await Product.findById(params.productId);
        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not Founded' }), {
                status: 404,
            });
        }

        const relatedProducts = await Product.find({
            $or: [{ category: product.category }, { collections: { $in: product.collections } }],
            _id: { $ne: product._id }, // exclude the current product
        });
        if (!relatedProducts) {
            return new NextResponse(JSON.stringify({ message: 'No Related Product Found' }), {
                status: 404,
            });
        }

        return NextResponse.json(relatedProducts, { status: 200, headers: corsHeader });
    } catch (error: any) {
        console.log('[related_GET]', error?.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500 }
        );
    }
};

export const dynamic = 'force-dynamic';
