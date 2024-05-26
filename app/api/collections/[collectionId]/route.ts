import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import Collection from '@/models/Collection';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';

export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        await connectToDB();

        let collection = await Collection.findById(params.collectionId);

        if (!collection) {
            return new NextResponse(JSON.stringify({ message: 'Collection Not Found' }), {
                status: 404,
            });
        }

        return NextResponse.json(collection, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error: any) {
        console.log('[Collections_GET]', error?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }
        await connectToDB();

        let collection = await Collection.findById(params.collectionId);
        if (!collection) {
            return new NextResponse(JSON.stringify({ message: 'collection not found' }), {
                status: 401,
            });
        }

        const { title, image, description } = await req.json();

        if (!title || !image) {
            return new NextResponse(JSON.stringify({ message: 'Title or Image are required' }), {
                status: 401,
            });
        }

        collection = await Collection.findByIdAndUpdate(
            params.collectionId,
            { title, image, description },
            { new: true }
        );

        return NextResponse.json(collection, { status: 200 });
    } catch (error: any) {
        console.log('[Collections_POST]', error?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { collectionId: string } }
) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        await connectToDB();

        await Collection.findByIdAndDelete(params.collectionId);

        await Product.updateMany(
            { collections: params.collectionId },
            { $pull: { collections: params.collectionId } }
        );

        return new NextResponse(JSON.stringify({ message: 'collection is deleted' }), {
            status: 200,
        });
    } catch (error: any) {
        console.log('[Collections_DELETE]', error?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
