'use client';

import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';
import { columns, ProductDataProp } from '@/components/products/ProductColumns';

const Products = () => {
    const router = useRouter();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ProductDataProp[]>([]);

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight) {
            setPage((prevPage: number) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products?page=${page}`, { method: 'GET' });
                const { products } = await res.json();
                if (products) {
                    setData([...data, ...products]);
                }
            } catch (error) {
                console.log('Product_GET', error);
                toast.error('something went wrong! Please try Again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    return (
        <div className='px-2 py-5 min-h-screen'>
            <div className='flex justify-between items-center p-2'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Products</p>
                <Button onClick={() => router.push('/products/new')}>
                    <Plus className='mr-2' />
                    Create
                </Button>
            </div>

            {loading ? <Loader /> : <DataTable columns={columns} data={data} searchKey='title' />}
        </div>
    );
};

export default Products;
