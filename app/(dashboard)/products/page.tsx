import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/products/ProductColumns';

const Products = async () => {
    const router = useRouter();
    try {
        const res = await fetch('/api/products');
        const products = await res.json();

        return (
            <div className='sm:px-8 px-2 py-10'>
                <div className='flex justify-between items-center'>
                    <p className='sm:text-heading2-bold text-heading3-bold'>Products</p>
                    <Button
                        className=' bg-blue-1 hover:bg-blue-1/90 text-white'
                        onClick={() => router.push('/products/new')}>
                        <Plus className='mr-2' />
                        Create
                    </Button>
                </div>
                <Separator className='bg-grey-2 my-4' />
                <DataTable columns={columns} data={products} searchKey='title' />
            </div>
        );
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

export default Products;
