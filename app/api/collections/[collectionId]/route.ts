import Collection from '@/lib/models/Collection';
import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        await connectToDB();

        let collection = await Collection.findById(params.collectionId);

        if (!collection) {
            return new NextResponse('Collection Not Found', { status: 404 });
        }

        return NextResponse.json(collection, { status: 200 });
    } catch (error) {
        console.log('[Collections_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        await connectToDB();

        let collection = await Collection.findById(params.collectionId);
        if (!collection) {
            return new NextResponse('collection not found', { status: 401 });
        }

        const { title, image, description } = await req.json();

        if (!title || !image) {
            return new NextResponse('Title or Image are required', { status: 401 });
        }

        collection = await Collection.findByIdAndUpdate(
            params.collectionId,
            { title, image, description },
            { new: true }
        );

        return NextResponse.json(collection, { status: 200 });
    } catch (error) {
        console.log('[Collections_POST]', error);
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
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await connectToDB();

        await Collection.findByIdAndDelete(params.collectionId);

        await Product.updateMany(
            { collections: params.collectionId },
            { $pull: { collections: params.collectionId } }
        );

        return new NextResponse('collection is deleted', { status: 200 });
    } catch (error) {
        console.log('[Collections_DELETE]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
