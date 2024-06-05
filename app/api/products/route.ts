import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/lib/mongoDB';
import Product from '@/models/Product';
import Collection from '@/models/Collection';

// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await connectToDB();

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
            return new NextResponse('Not enough data to create a product', {
                status: 400,
            });
        }

        const newProduct = await Product.create({
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
        });

        await newProduct.save();

        if (collections) {
            for (const collectionId of collections) {
                const collection = await Collection.findById(collectionId);
                if (collection) {
                    collection.products.push(newProduct._id);
                    await collection.save();
                }
            }
        }

        return NextResponse.json(newProduct, { status: 200 });
    } catch (err) {
        console.log('[products_POST]', err);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const searchParams = req.nextUrl.searchParams;
        const page = searchParams.get('page');

        await connectToDB();

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'collections',
                    localField: 'collections',
                    foreignField: '_id',
                    as: 'collectionsDetail',
                },
            },
            {
                $unwind: '$media',
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    expense: 1,
                    category: 1,
                    price: {
                        $subtract: ['$expense', 99],
                    },
                    collections: '$collectionsDetail.title',
                    media: 1,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page || 1) - 1) * 20 },
            { $limit: 20 },
        ]);

        // const products = await Product.find()
        //     .sort({ createdAt: 'desc' });
        // // .populate({ path: 'collections', model: Collection });

        // const userId = 'user_2giVcBrphsuZvaPEDl2kpdD4VIx';

        // const products = data.map(async (item) => {
        //     const uploadMultiImag = async (images: string[]) => {
        //         try {
        //             if (images.length === 0) return [];
        //             const uploadPromises = images.map(async (file) => {
        //                 try {
        //                     const uploadImage = await cloudinary.uploader.upload(file, {
        //                         resource_type: 'image',
        //                     });
        //                     return uploadImage.secure_url;
        //                 } catch (error) {
        //                     return null;
        //                 }
        //             });
        //             const urls = await Promise.all(uploadPromises);
        //             const result = urls.filter((url) => url !== null);
        //             return result;
        //         } catch (error) {
        //             return [];
        //         }
        //     };

        //     const newMedia = await uploadMultiImag(item.media);

        //     const newProduct = await Product.create({
        //         ...item,
        //         media: newMedia,
        //     });

        //     if (item.collections) {
        //         for (const collectionId of item.collections) {
        //             const collection = await Collection.findById(collectionId);
        //             if (collection) {
        //                 collection.products.push(newProduct._id);
        //                 await collection.save();
        //             }
        //         }
        //     }

        //     await newProduct.save();

        //     return newProduct;
        // });

        // const products = await Product.deleteMany({
        //     category: 'mattress',
        // });

        // const products = await Product.find({
        //     collections: { $in: [new mongoose.Types.ObjectId('665f55c84b8c43fa50443baf')] },
        // }).countDocuments();

        return NextResponse.json(products, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (err: any) {
        console.log('[products_GET]', err.message);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
