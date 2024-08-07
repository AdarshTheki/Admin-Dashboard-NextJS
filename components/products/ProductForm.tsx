'use client';

import { z } from 'zod';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Separator } from '../ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';

import ImageUpload from '../customUI/ImageUpload';
import Delete from '../customUI/Delete';
import Loader from '../customUI/Loader';
import MultiText from '../customUI/MultiText';
import MultiSelect from '../customUI/MultiSelect';

const formSchema = z.object({
    title: z.string().min(2).max(30),
    description: z.string().min(2).max(500).trim(),
    collections: z.array(z.string()),
    media: z.array(z.string()),
    tags: z.array(z.string()),
    price: z.coerce.number().min(5),
    discount: z.coerce.number().min(0.1).max(50),
    rating: z.number().min(0).max(5),
    stock: z.number().min(5).max(100),
    category: z.string(),
});

interface ProductFormProps {
    initialData?: ProductType | null; // Must have '?' to make is optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [collections, setCollections] = useState<CollectionType[]>([]);

    const getCollections = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/collections', { method: 'GET' });
            const data = await res.json();
            setCollections(data);
        } catch (error) {
            console.log('[Products_GET]', error);
            toast.error('Something was wrong! Please Try Again');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCollections();
    }, []);

    const handleKeyPress = (
        e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  price: Number(initialData.price || 10),
                  discount: Number(initialData.discount || 2),
                  rating: Number(initialData.rating || 4),
                  stock: Number(initialData.stock || 10),
                  collections: initialData.collections.map((collection) => collection._id),
              }
            : {
                  title: '',
                  description: '',
                  category: '',
                  media: [],
                  collections: [],
                  tags: [],
                  price: 10.5,
                  discount: 6.8,
                  rating: 5,
                  stock: 20,
              },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const url = initialData ? `/api/products/${initialData._id}` : '/api/products';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                setLoading(false);
                toast.success(`Collection ${initialData ? 'Updated' : 'Created'}`);
                window.location.href = '/products';
                router.push('/products');
            }
        } catch (error) {
            console.log('[Products_POST]', error);
            toast.error('Something went wrong! Please Try Again.');
        } finally {
            setLoading(false);
        }
    };

    return loading ? (
        <Loader />
    ) : (
        <div className='sm:px-8 px-2 py-10'>
            {initialData ? (
                <div className='flex items-center justify-between'>
                    <p className='sm:text-heading2-bold text-heading3-bold'>Edit Product</p>
                    <Delete id={initialData._id} item='product' />
                </div>
            ) : (
                <p className='sm:text-heading2-bold text-heading3-bold'>Create Product</p>
            )}
            <Separator className='bg-grey-1 mt-4 mb-7' />
            {/* Create Form Collections */}
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Title...'
                                        {...field}
                                        onKeyDown={handleKeyPress}
                                    />
                                </FormControl>
                                <FormMessage className='text-red-1 font-light' />
                            </FormItem>
                        )}
                    />
                    {/* Descriptions */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Description...'
                                        {...field}
                                        rows={5}
                                        onKeyDown={handleKeyPress}
                                    />
                                </FormControl>
                                <FormMessage className='text-red-1 font-light' />
                            </FormItem>
                        )}
                    />

                    {/* Image Uploaded */}
                    <FormField
                        control={form.control}
                        name='media'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Multi-Image <small>(Note: First image it will Thumbnail)</small>
                                </FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(url) => field.onChange([...field.value, url])}
                                        onRemove={(url) =>
                                            field.onChange([
                                                ...field.value.filter((img) => img !== url),
                                            ])
                                        }
                                    />
                                </FormControl>
                                <FormMessage className='text-red-1 font-light' />
                            </FormItem>
                        )}
                    />
                    <div className='sm:grid sm:grid-cols-3 gap-5'>
                        {/* Price */}
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='Price'
                                            {...field}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1 font-light' />
                                </FormItem>
                            )}
                        />
                        {/* Discount */}
                        <FormField
                            control={form.control}
                            name='discount'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='Discount'
                                            {...field}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1 font-light' />
                                </FormItem>
                            )}
                        />
                        {/* rating */}
                        <FormField
                            control={form.control}
                            name='rating'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1 font-light' />
                                </FormItem>
                            )}
                        />
                        {/* stock */}
                        <FormField
                            control={form.control}
                            name='stock'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1 font-light' />
                                </FormItem>
                            )}
                        />
                        {/* Category */}
                        <FormField
                            control={form.control}
                            name='category'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Category'
                                            {...field}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1' />
                                </FormItem>
                            )}
                        />
                        {/* Tags */}
                        <FormField
                            control={form.control}
                            name='tags'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder='Tags'
                                            value={field.value}
                                            onChange={(tag) =>
                                                field.onChange([...field.value, tag])
                                            }
                                            onRemove={(tagToRemove) =>
                                                field.onChange([
                                                    ...field.value.filter(
                                                        (tag) => tag !== tagToRemove
                                                    ),
                                                ])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1 font-light' />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* collections */}
                    {collections.length > 0 && (
                        <FormField
                            control={form.control}
                            name='collections'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collections</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            placeholder='Collections'
                                            collections={collections}
                                            value={field.value || []}
                                            onChange={(_id) =>
                                                field.onChange([...(field.value || []), _id])
                                            }
                                            onRemove={(idToRemove) =>
                                                field.onChange([
                                                    ...(field.value || []).filter(
                                                        (collectionId) =>
                                                            collectionId !== idToRemove
                                                    ),
                                                ])
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-1 font-light' />
                                </FormItem>
                            )}
                        />
                    )}
                    <div className='flex gap-10'>
                        <Button type='submit'>Submit</Button>
                        <Button
                            variant={'destructive'}
                            type='button'
                            onClick={() => router.push('/products')}>
                            Discard
                        </Button>
                    </div>
                </Form>
            </form>
        </div>
    );
};

export default ProductForm;
