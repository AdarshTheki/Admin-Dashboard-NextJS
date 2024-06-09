import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import Collection from '@/models/Collection';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { corsHeader } from '@/lib/constant';

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connectToDB();

        let product = await Product.findById(params.productId).populate({
            path: 'collections',
            model: Collection,
        });

        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
                status: 404,
            });
        }

        return NextResponse.json(product, { status: 200, headers: corsHeader });
    } catch (error: any) {
        console.log('[productId_GET]', error.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500 }
        );
    }
};

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: 'Unauthorized Request, Please Login...' }),
                { status: 401 }
            );
        }
        await connectToDB();

        let product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
                status: 404,
            });
        }

        const {
            title,
            description,
            collections,
            media,
            price,
            discount,
            rating,
            stock,
            tags,
            category,
        }: ProductType = await req.json();

        if (
            !title ||
            !description ||
            !category ||
            !price ||
            !discount ||
            !rating ||
            !stock ||
            !media.length ||
            !tags.length ||
            !collections.length
        ) {
            return new NextResponse(
                JSON.stringify({ message: 'Not enough data to create a product' }),
                { status: 400 }
            );
        }

        // included in new data, but not included in the previous data
        const addedCollections = collections.filter((id) => !product.collections.includes(id));

        // included in previous data, but not included in the new data
        const removedCollections = product.collections.filter(
            (id) => !collections.includes(id?.toString())
        );

        // Update collections
        await Promise.all([
            // Update added collections with this product
            ...addedCollections.map((collectionId) =>
                Collection.findByIdAndUpdate(
                    collectionId,
                    {
                        $push: { products: product._id },
                    },
                    { new: true }
                )
            ),
            // Update removed collections without this product
            ...removedCollections.map((collectionId) =>
                Collection.findByIdAndUpdate(
                    collectionId,
                    {
                        $pull: { products: product._id },
                    },
                    { new: true }
                )
            ),
        ]);

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            product._id,
            {
                title,
                description,
                collections,
                media,
                price,
                discount,
                rating,
                stock,
                tags,
                category,
                thumbnail: media[0],
            },
            { new: true }
        );

        await updatedProduct.save();

        return new NextResponse(JSON.stringify({ message: 'product updated successfully' }), {
            status: 200,
        });
    } catch (error: any) {
        console.log('[productId_POST]', error.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500 }
        );
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: 'Unauthorized Request, Please Login...' }),
                { status: 401 }
            );
        }

        await connectToDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
                status: 404,
            });
        }

        await Product.findByIdAndDelete(product._id);

        // Update collections
        await Promise.all(
            product.collections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id },
                })
            )
        );

        return new NextResponse(JSON.stringify({ message: 'Product deleted Successfully' }), {
            status: 200,
        });
    } catch (err: any) {
        console.log('[product_DELETE]', err.message);
        return new NextResponse(
            JSON.stringify({ message: 'Internal Server Error', error: err.message }),
            { status: 500 }
        );
    }
};

export const dynamic = 'force-dynamic';
