'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/products?page=${page}`, { method: 'GET' });
      const { products } = await res.json();

      if (products) {
        setData((prevData) => [...prevData, ...products]);
        setHasMore(false); // Update hasMore based on API response
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Something went wrong! Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  return (
    <div className='px-2 py-5 min-h-screen'>
      <div className='flex justify-between items-center p-2'>
        <p className='sm:text-heading2-bold text-heading3-bold'>Products</p>
        <Button onClick={() => router.push('/products/new')}>
          <Plus className='mr-2' />
          Create
        </Button>
      </div>

      <DataTable columns={columns} data={data} searchKey='title' />

      {loading && <Loader />}

      <div ref={lastElementRef} className='h-10'></div>
    </div>
  );
};

export default Products;
