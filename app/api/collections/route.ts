// import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/lib/mongoDB';
import Collection from '@/models/Collection';
import { corsHeader } from '@/lib/constant';

export async function POST(req: NextRequest) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //     return new NextResponse(
    //         JSON.stringify({ message: 'UnAuthorized Request, Please Login...' }),
    //         { status: 403 }
    //     );
    // }

    const { title, description, image } = await req.json();

    await connectToDB();

    const newCollection = await Collection.create({ title, description, image });

    await newCollection.save();

    return new NextResponse(JSON.stringify({ message: 'created collection successfully' }), {
      status: 200,
    });
  } catch (error: any) {
    console.log('[collection_POST]', error?.message);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}

export const GET = async () => {
  try {
    await connectToDB();

    const collections = await Collection.find().sort({ updatedAt: -1 });

    return NextResponse.json(collections, {
      status: 200,
      headers: corsHeader,
    });
  } catch (err: any) {
    console.log('[collections_GET]', err?.message);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: err.message }),
      { status: 500 }
    );
  }
};

export const dynamic = 'force-dynamic';
