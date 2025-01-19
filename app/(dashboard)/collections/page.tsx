'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { columns } from '@/components/collections/CollectionColumns';

import { DataTable } from '@/components/customUI/DataTable';
import Loader from '@/components/customUI/Loader';
import useFetch from '@/components/hook/useFetch';

const Collections = () => {
    const router = useRouter();
    const { data, loading, error } = useFetch<CollectionType[]>('/api/collections');

    return loading || error ? (
        <Loader />
    ) : (
        <div className='sm:px-8 px-2 py-10'>
            <div className='flex justify-between items-center'>
                <p className='sm:text-heading2-bold  text-heading3-bold'>Collections</p>
                <Button onClick={() => router.push('/collections/new')}>
                    <Plus className='mr-2' />
                    Create
                </Button>
            </div>
            <Separator className='bg-grey-2 my-4' />
            <DataTable columns={columns} data={data || []} searchKey='title' />
        </div>
    );
};

export default Collections;
