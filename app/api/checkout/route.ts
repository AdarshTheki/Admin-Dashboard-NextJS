import { header } from '@/lib/mongoDB';
import stripe from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
    return NextResponse.json({}, { headers: header });
}

export async function POST(req: NextRequest, res:NextResponse) {
    try {
        const { cartItems, customer } = await req.json();

        if (!cartItems || !customer) {
            return new NextResponse('Not enough data to checkout', { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            shipping_options: [
                { shipping_rate: 'shr_1PJwYJSEX6kzN9W07CeXP7cF' },
                { shipping_rate: 'shr_1PJwXiSEX6kzN9W0q3rKZSWo' },
            ],
            line_items: cartItems.map((cartItem: any) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: cartItem.item.title,
                        metadata: {
                            productId: cartItem.item._id,
                            ...(cartItem.size && { size: cartItem.size }),
                            ...(cartItem.color && { color: cartItem.color }),
                        },
                    },
                    unit_amount: cartItem.item.price,
                },
                quantity: cartItem.quantity,
            })),
            client_reference_id: customer.clerkId,
            success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
            cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
        });

        return NextResponse.json(session, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (err: any) {
        console.log('[checkout_POST]', err?.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
