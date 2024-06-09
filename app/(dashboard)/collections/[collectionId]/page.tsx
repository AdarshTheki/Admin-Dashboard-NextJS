'use client';

import { useEffect, useState } from 'react';

import Loader from '@/components/customUI/Loader';
import CollectionForm from '@/components/collections/CollectionForm';

const CollectionId = ({ params }: { params: { collectionId: string } }) => {
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState<CollectionType | null>(null);

    useEffect(() => {
        const getCollectionDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/collections/${params.collectionId}`, {
                    method: 'GET',
                });
                const data = await res.json();
                setCollection(data);
            } catch (error) {
                console.log('collection_GET', error);
            } finally {
                setLoading(false);
            }
        };

        getCollectionDetails();
    }, [params.collectionId]);

    return loading ? <Loader /> : <CollectionForm initialData={collection} />;
};

export default CollectionId;
