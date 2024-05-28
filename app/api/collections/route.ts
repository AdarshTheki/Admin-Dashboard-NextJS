import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/lib/mongoDB';
import Collection from '@/models/Collection';

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse(JSON.stringify({ message: 'UnAuthorized' }), { status: 403 });
        }

        await connectToDB();

        const { title, description, image } = await req.json();
        const existingCollection = await Collection.findOne({ title });

        if (existingCollection) {
            return new NextResponse(JSON.stringify({ message: 'Collection already exists' }), {
                status: 400,
            });
        }

        if (!title || !image) {
            return new NextResponse(JSON.stringify({ message: 'Title and image are required' }), {
                status: 400,
            });
        }
        const newCollection = await Collection.create({
            title,
            description,
            image,
        });

        await newCollection.save();

        return NextResponse.json(newCollection, { status: 200 });
    } catch (error: any) {
        console.log('[collection_POST]', error?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const GET = async () => {
    try {
        await connectToDB();

        const collections = await Collection.find().sort({ createdAt: 'desc' });

        return NextResponse.json(collections, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (err: any) {
        console.log('[collections_GET]', err?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
