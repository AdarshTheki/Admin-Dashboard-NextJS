import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { corsHeader } from '@/lib/constant';
import { connectToDB } from '@/lib/mongoDB';
import Product from '@/models/Product';
import Collection from '@/models/Collection';

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized Request, Please Login...', { status: 401 });
    }

    await connectToDB();

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
      !media.length
    ) {
      return new NextResponse(JSON.stringify({ message: 'Not enough data to create a product' }), {
        status: 400,
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      collections,
      media,
      thumbnail: media[0],
      price,
      discount,
      rating,
      stock,
      tags,
      category,
    });

    await newProduct.save();

    if (collections.length) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return new NextResponse(JSON.stringify({ message: 'Created New Product Successfully' }), {
      status: 200,
    });
  } catch (err: any) {
    console.log('[products_POST]', err.message);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: err.message }),
      { status: 500 }
    );
  }
};
export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    let page = Number(searchParams.get('page')) || 1;
    let limit = Number(searchParams.get('limit')) || 20;
    let sortBy = searchParams.get('sortBy') || 'createdAt';
    let orderBy = searchParams.get('orderBy');

    await connectToDB();

    const products: any = await Product.aggregate([
      {
        $facet: {
          totals: [{ $count: 'count' }],
          items: [
            {
              $lookup: {
                from: 'collections',
                localField: 'collections',
                foreignField: '_id',
                as: 'collectionsDetail',
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                category: 1,
                expense: 1,
                price: 1,
                discount: 1,
                rating: 1,
                thumbnail: 1,
                collections: '$collectionsDetail.title',
              },
            },
            { $sort: { [sortBy]: orderBy === 'asc' ? 1 : -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
        },
      },
    ]);

    const totals = products[0].totals[0].count;
    const totalPage = Math.ceil(totals / limit);
    const hasMore = page < totalPage;

    return NextResponse.json(
      {
        products: products[0].items,
        totalProduct: totals,
        currentPage: page,
        totalPage,
        limit,
        hasMore,
      },
      { status: 200, headers: corsHeader }
    );
  } catch (err: any) {
    console.log('[products_GET]', err.message);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: err.message }),
      { status: 500 }
    );
  }
};

export const dynamic = 'force-dynamic';
