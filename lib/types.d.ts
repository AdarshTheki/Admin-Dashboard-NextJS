type CollectionType = {
    _id: string;
    title: string;
    description: string;
    image: string;
    products: ProductType[];
};

type ProductType = {
    _id: string;
    title: string;
    description: string;
    collections: [CollectionType];
    media: [string];
    thumbnail: string;
    price: number;
    discount: number;
    rating: number;
    stock: number;
    tags: [string];
    category: string;
    createdAt: Date;
    updatedAt: Date;
};

type OrderColumnType = {
    _id: string;
    customer: string;
    products: number;
    totalAmount: number;
    createdAt: string;
};

type OrderItemType = {
    _id: string;
    product: ProductType;
    color: string;
    size: string;
    quantity: number;
};

type CustomerType = {
    clerkId: string;
    name: string;
    email: string;
    orders: [string];
    createdAt: Date;
};

// Orders
type AddressType = {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

type OrderType = {
    _id: string;
    customerClerkId: string;
    products: [OrderItemType];
    shippingAddress: AddressType;
    shippingRate: string;
    totalAmount: number;
    createdAt: Date;
};
