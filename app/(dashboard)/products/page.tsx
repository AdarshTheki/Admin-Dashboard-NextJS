'use client';

import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';
import { columns } from '@/components/products/ProductColumns';

interface ProductDataProp {
    products: [ProductType];
    totalProduct: number;
    currentPage: number;
    totalPage: number;
}

const Products = () => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ProductDataProp>();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products?page=${page}&limit=${limit}`, {
                    method: 'GET',
                });
                const products = await res.json();
                setData(products);
            } catch (error) {
                console.log('Product_GET', error);
                toast.error('something went wrong! Please try Again.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, limit]);

    React.useEffect(() => {
        const outsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', outsideClick);
        return () => document.removeEventListener('mousedown', outsideClick);
    }, [dropdownRef]);

    return (
        <div className='sm:px-8 px-2 py-10'>
            <div className='flex justify-between items-center'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Products</p>
                <Button onClick={() => router.push('/products/new')}>
                    <Plus className='mr-2' />
                    Create
                </Button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* Select Limit */}
                    <div className='relative w-[180px] mt-5'>
                        <button
                            className='py-2 w-full rounded-lg border flex items-center justify-center gap-2 bg-blue-1 text-white'
                            onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                            <span>Select Limit: {limit}</span>
                        </button>
                        {isOpen && (
                            <div
                                ref={dropdownRef}
                                className='absolute w-full list-none overflow-hidden border rounded-lg shadow-2xl z-30 bg-white'>
                                {Array.from({ length: 5 }, (_, index) => {
                                    index += 1;
                                    return (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                setLimit(index * 10);
                                                setIsOpen(false);
                                            }}
                                            className='py-2 text-center cursor-pointer border-b hover:bg-gray-300'>
                                            {index}0 / page
                                        </li>
                                    );
                                })}
                                <li
                                    onClick={() => {
                                        setLimit(100);
                                        setIsOpen(false);
                                    }}
                                    className='py-2 text-center cursor-pointer border-b hover:bg-gray-300'>
                                    100 / page
                                </li>
                            </div>
                        )}
                    </div>

                    <DataTable columns={columns} data={data?.products || []} searchKey='title' />
                    <div className='flex items-center justify-center flex-wrap gap-2 py-5'>
                        {Array.from({ length: data?.totalPage || 5 }, (_, index) => {
                            index += 1;
                            return (
                                <button
                                    onClick={() => setPage(index)}
                                    key={index}
                                    className={`border min-w-8 px-2 py-0.5 rounded-full hover:bg-blue-400 ${
                                        page === index ? 'bg-blue-700 text-white' : ''
                                    }`}>
                                    {index}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Products;
