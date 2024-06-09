'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/customUI/Loader';
import ProductForm from '@/components/products/ProductForm';

const ProductDetail = ({ params }: { params: { productId: string } }) => {
    const [loading, setLoading] = useState(false);
    const [productDetail, setProductDetail] = useState<ProductType | null>(null);

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${params.productId}`, { method: 'GET' });
                const data = await res.json();
                setProductDetail(data);
            } catch (error) {
                console.log('[productId_GET]', error);
            } finally {
                setLoading(false);
            }
        };
        getProductDetails();
    }, [params.productId]);

    return loading ? <Loader /> : <ProductForm initialData={productDetail} />;
};

export default ProductDetail;
