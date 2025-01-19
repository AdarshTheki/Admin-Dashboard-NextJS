'use client';

import React from 'react';
import Loader from '@/components/customUI/Loader';
import CollectionForm from '@/components/collections/CollectionForm';
import useFetch from '@/components/hook/useFetch';

const CollectionId = ({ params }: { params: { collectionId: string } }) => {
    const { data, error, loading } = useFetch<CollectionType>(
        `/api/collections/${params.collectionId}`
    );

    return loading || error ? <Loader /> : <CollectionForm initialData={data} />;
};

export default CollectionId;
