import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { columns } from '@/components/collections/CollectionColumns';
import { DataTable } from '@/components/customUI/DataTable';

const Collections = async () => {
    try {
        const router = useRouter();
        const res = await fetch('/api/collections');
        const collection = await res.json();

        return (
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
    } catch (error: any) {
        console.error('Error fetching collection:', error?.message);
        return (
            <div className='sm:px-8 px-2 py-10'>
                <p className='sm:text-heading2-bold text-heading3-bold'>Error</p>
                <p>Failed to load collection. Please try again later.</p>
            </div>
        );
    }
};

export const dynamic = 'force-dynamic';

export default Collections;
