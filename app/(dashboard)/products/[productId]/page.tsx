import ProductForm from '@/components/products/ProductForm';

const ProductDetail = async ({ params }: { params: { productId: string } }) => {
    try {
        const res = await fetch(`/api/products/${params.productId}`);
        const productDetail = await res.json();

        return <ProductForm initialData={productDetail} />;
    } catch (error: any) {
        console.error('Error fetching products:', error?.message);
        return (
            <div className='sm:px-8 px-2 py-10 text-center'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Error</p>
                <p>Failed to load products. Please try again later.</p>
            </div>
        );
    }
};

export const dynamic = 'force-dynamic';

export default ProductDetail;
