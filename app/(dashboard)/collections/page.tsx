'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { columns } from '@/components/collections/CollectionColumns';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';

const Collections = () => {
    const router = useRouter();

    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCollection = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/collections', { method: 'GET' });
            const data = await res.json();
            setCollection(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCollection();
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <div className='sm:px-8 px-2 py-10'>
            <div className='flex justify-between items-center'>
                <p className='sm:text-heading2-bold  text-heading3-bold'>Collections</p>
                <Button
                    className=' bg-blue-1 hover:bg-blue-1/90 text-white'
                    onClick={() => router.push('/collections/new')}>
                    <Plus className='mr-2' />
                    Create
                </Button>
            </div>
            <Separator className='bg-grey-2 my-4' />
            <DataTable columns={columns} data={collection} searchKey='title' />
        </div>
    );
};

export default Collections;
