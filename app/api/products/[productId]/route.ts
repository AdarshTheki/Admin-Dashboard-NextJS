import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import Collection from '@/models/Collection';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import mongoose, { ObjectId } from 'mongoose';

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

        return NextResponse.json(product, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error: any) {
        console.log('[productId_GET]', error.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
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
            media,
            category,
            collections,
            tags,
            sizes,
            colors,
            price,
            expense,
        } = await req.json();

        if (!title || !description || !media || !category || !price || !expense) {
            return new NextResponse('Not enough data to create a new product', {
                status: 400,
            });
        }

        // convert object into string
        const productCollections = product?.collections?.map((i: any) => i?.toString());

        // included in new data, but not included in the previous data
        const addedCollections = collections.filter(
            (id: string) => !productCollections.includes(id)
        );

        // included in previous data, but not included in the new data
        const removedCollections = productCollections.filter(
            (id: string) => !collections.includes(id)
        );

        // Update collections
        await Promise.all(
            // Update added collections with this product
            addedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(
                    new mongoose.Types.ObjectId(collectionId),
                    {
                        $push: { products: product._id },
                    },
                    { new: true }
                )
            )
        );

        await Promise.all(
            // Update removed collections without this product
            removedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(
                    new mongoose.Types.ObjectId(collectionId),
                    {
                        $pull: { products: product._id },
                    },
                    { new: true }
                )
            )
        );

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            product._id,
            {
                title,
                description,
                media,
                category,
                collections,
                tags,
                sizes,
                colors,
                price,
                expense,
            },
            { new: true }
        ).populate({ path: 'collections', model: Collection });

        await updatedProduct.save();

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.log('[productId_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
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

        return new NextResponse(JSON.stringify({ message: 'Product deleted' }), {
            status: 200,
        });
    } catch (error) {
        console.log('[product_DELETE]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
