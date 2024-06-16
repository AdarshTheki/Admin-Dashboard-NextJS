'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';
import { columns } from '@/components/products/ProductColumns';

const Products = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState(0);
    const [limit, setLimit] = useState(20);
    const [skip, setSkip] = useState(0);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products?limit=${limit}&skip=${skip}`, {
                    method: 'GET',
                });
                const data = await res.json();
                setProducts(data.products);
                setTotals(data.totals);
            } catch (error) {
                console.log('Product_GET', error);
                toast.error('something went wrong! Please try Again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [totals, limit, skip]);

    return loading ? (
        <Loader />
    ) : (
        <div className='sm:px-8 px-2 py-10'>
            <div className='flex justify-between items-center'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Products</p>
                <Button onClick={() => router.push('/products/new')}>
                    <Plus className='mr-2' />
                    Create
                </Button>
            </div>
            <Separator className='bg-grey-2 my-4' />
            <DataTable columns={columns} data={products} searchKey='title' />
            <div className='flex items-center justify-center gap-5 py-5'>
                {products.length > 19 && (
                    <Button onClick={() => setSkip((prev: number) => prev + 1)}>Next</Button>
                )}
                {skip > 1 && (
                    <Button onClick={() => setSkip((prev: number) => prev - 1)}>Previous</Button>
                )}
            </div>
        </div>
    );
};

export default Products;
