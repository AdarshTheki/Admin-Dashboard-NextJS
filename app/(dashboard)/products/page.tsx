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

      <div className='max-md:hidden'>
        <DataTable columns={columns} data={data} searchKey='title' />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:hidden sm:gap-4 gap-2'>
        {data.length && data.map((item) => <ProductCart key={item._id} item={item} />)}
      </div>

      {loading && <Loader />}

      <div ref={lastElementRef} className='h-10'></div>
    </div>
  );
};

export default Products;

const ProductCart = ({ item }: { item: ProductDataProp }) => {
  return (
    <div className='px-4 py-2 rounded-lg border bg-gray-50 space-y-4'>
      <h2 className='md:text-base-medium'>{item.title}</h2>
      <p className='bg-gray-300 px-4 py-1 rounded-2xl text-small-medium w-fit'>{item.category}</p>
      {item.collections.length
        ? item.collections.map((i) => (
            <span key={i._id} className='px-3 py-1 bg-yellow-600 rounded-2xl'>
              {i.title}
            </span>
          ))
        : null}
      <div className='flex justify-between'>
        <p className='text-body-bold'>${item.price}</p>
        <p className='text-green-600'>{item.discount}%</p>
      </div>
    </div>
  );
};
