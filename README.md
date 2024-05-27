## E-Commerce website with an Admin Dashboard

Build and Deploy a full stack integrated E-Commerce website with an Admin Dashboard using Next.js 14, Stripe for payment, TypeScript, MongoDB for all database management, Clerk for authentication and user management, React-Hook-Form for form validation, Tailwind CSS & Shadcn UI for a stunning responsive UI design, and Next Cloudinary for image upload and storage.

- Master Next.js 14 with Server-side & Client-side Rendering
- Use Clerk for Authentication & Users management
- Create collections & products with React-Hook-Form for form validation
- Create all Data Tables for collections, products, orders and customers with Search bar
- Handle Search, Add to Wishlist, Add to Cart functions
- Checkout and create orders with Stripe
- Learn MongoDB handling and populating nested schemas
- Create unique & responsive UI design with Tailwind CSS, Shadcn UI, and Recharts for graph
- Image upload and storage using Cloudinary 
- Explore & integrate new Next.js layout route groups
- Create reusable components
- Deploy the application and more!

### Relation between Collections and Products

-   **Collection:**

    -   Create + Update -> No change in products
    -   Delete collection -> Remove that collection in products

-   **Products:**
    -   Create Product -> add that product to collection
    -   Update collection in product -> Add or Remove that product tn collection
    -   Delete product -> remove that product in collections

### Products API

-   Get All Products = GET /api/products
-   Create Product = POST /api/products/new

-   Single Product = GET /api/products/productId
-   update Product = POST /api/products/productId
-   Delete Product = DELETE /api/products/productId

## Stripe step-by-step guide:

1. **Install Necessary Packages**

```bash
npm install stripe
npm install @types/stripe
```

2. **Set Up Environment Variables `.env.local`**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

3. **Create a Checkout Session**

Create an API route to handle creating a Stripe Checkout Session. This will be used on the client side to redirect users to the Stripe payment page `/pages/api/create-checkout-session.ts`

```js
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export const POST = async (req: NextRequest) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'T-shirt',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        return NextResponse.json(session, { headers: corsHeaders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

4. **Handle the Checkout on the Client**

Create a client-side function to call the API route and redirect to the Stripe Checkout page. `/pages/index.tsx`

```js
const handleCheckout = async () => {
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
    });
    const data = await response.json();

    if (response.ok) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        stripe?.redirectToCheckout({ sessionId: data.id });
    } else {
        console.error(data.error);
    }
};
```

5. **Set Up a Webhook to Handle Events**

Create an API route to handle Stripe webhook events. `/pages/api/webhook.ts`

```js
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const POST  = async(req:NextRequest) => {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('Error verifying webhook signature:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Fulfill the purchase...
        console.log('Payment received!');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}
```

6. **Testing Webhooks Locally**

To test webhooks locally, you can use the Stripe CLI to forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```
