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
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/products', { method: 'GET' });
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.log('Product_GET', error);
            toast.error('something went wrong! Please try Again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts()
    },[])

    return loading ? (
        <Loader />
    ) : (
        <div className='sm:p-5'>
            <div className='flex justify-between items-center'>
                <p className='text-heading2-bold'>Products</p>
                <Button
                    className=' bg-blue-1 hover:bg-blue-1/90 text-white'
                    onClick={() => router.push('/products/new')}>
                    <Plus className='mr-2' />
                    Create Product
                </Button>
            </div>
            <Separator className='bg-grey-1 my-4' />
            <DataTable columns={columns} data={products} searchKey='title' />
        </div>
    );
};

export default Products;
