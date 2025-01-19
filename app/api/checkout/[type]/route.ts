import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/payment/stripe';

import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { connectToDB } from '@/lib/mongoDB';

export const POST = async (
    req: NextRequest,
    { params }: { params: { type: 'stripe' | 'paypal' | 'razorpay' } }
) => {
    try {
        if (params.type === 'stripe') {
            const rawBody = await req.text();
            const signature = req.headers.get('stripe-signature') as string;

            if (!rawBody || !signature) {
                return new NextResponse(
                    JSON.stringify({ message: 'Not enough data to text or headers' }),
                    { status: 400 }
                );
            }

            const event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;

                const customerInfo = {
                    clerkId: session?.client_reference_id,
                    name: session?.customer_details?.name,
                    email: session?.customer_details?.email,
                };

                const shippingAddress = {
                    street: session?.shipping_details?.address?.line1,
                    city: session?.shipping_details?.address?.city,
                    state: session?.shipping_details?.address?.state,
                    postalCode: session?.shipping_details?.address?.postal_code,
                    country: session?.shipping_details?.address?.country,
                };

                const retrieveSession = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items.data.price.product'],
                });

                const lineItems = await retrieveSession?.line_items?.data;

                const orderItems = lineItems?.map((item: any) => {
                    return {
                        product: item.price.product.metadata.productId,
                        color: item.price.product.metadata.color || 'N/A',
                        size: item.price.product.metadata.size || 'N/A',
                        quantity: item.quantity,
                    };
                });

                await connectToDB();

                const newOrder = new Order({
                    customerClerkId: customerInfo.clerkId,
                    products: orderItems,
                    shippingAddress,
                    shippingRate: session?.shipping_cost?.shipping_rate,
                    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
                });

                await newOrder.save();

                let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

                if (customer) {
                    customer.orders.push(newOrder._id);
                } else {
                    customer = new Customer({
                        ...customerInfo,
                        orders: [newOrder._id],
                    });
                }

                await customer.save();

                return new NextResponse('Order created successfully', { status: 200 });
            } else {
                return new NextResponse('checkout session is incomplete', { status: 400 });
            }
        } else if (params.type === 'paypal') {
            await connectToDB();
        }
    } catch (err: any) {
        console.log(`checkout: [${params.type}] : ${err.message}`);
        return NextResponse.json(
            { message: 'Failed to create the order', error: err.message },
            { status: 500 }
        );
    }
};
