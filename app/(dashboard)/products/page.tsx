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
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products?page=${page}`, { method: 'GET' });
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.log('Product_GET', error);
                toast.error('something went wrong! Please try Again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    return loading ? (
        <Loader />
    ) : (
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
            <div className='flex items-center justify-center gap-5 py-5'>
                {products.length > 19 && (
                    <Button
                        className='bg-grey-1 hover:bg-grey-1/80 text-white'
                        onClick={() => setPage((prev: number) => prev + 1)}>
                        Next Page
                    </Button>
                )}
                {page > 1 && (
                    <Button
                        className='bg-grey-1 hover:bg-grey-1/80 text-white'
                        onClick={() => setPage((prev: number) => prev - 1)}>
                        Previous Page
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Products;
