'use client';

import { useState, useEffect } from 'react';

const useFetch = <T,>(
    url: string,
    optional?: RequestInit
): { data: T | null; error: string | null; loading: boolean } => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const response = await fetch(url, { ...optional });
                if (!response.ok) {
                    throw new Error('something was wrong! Please check url');
                }
                const result = await response.json();
                setData(result);
            } catch (error: any) {
                setError(error.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, optional]);

    return { data, loading, error };
};

export default useFetch;
