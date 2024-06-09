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
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
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
    product: ProductType;
    color: string;
    size: string;
    quantity: number;
};

type CustomerType = {
    clerkId: string;
    name: string;
    email: string;
};
