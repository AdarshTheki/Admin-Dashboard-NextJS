import CollectionForm from '@/components/collections/CollectionForm';

const CollectionId = async ({ params }: { params: { collectionId: string } }) => {
    try {
        const res = await fetch(`/api/collections/${params.collectionId}`);
        const collection = await res.json();

        return <CollectionForm initialData={collection} />;
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

export default CollectionId;
