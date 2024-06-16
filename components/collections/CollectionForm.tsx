'use client';

import { z } from 'zod';
import React, { useState } from 'react';
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

const formSchema = z.object({
    title: z.string().min(2).max(30),
    description: z.string().min(2).max(500).trim(),
    image: z.string(),
});

interface CollectionFormProps {
    initialData?: CollectionType | null; // Must have '?' to make is optional
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
            ? initialData
            : {
                  title: '',
                  description: '',
                  image: '',
              },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const url = initialData ? `/api/collections/${initialData._id}` : '/api/collections';
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(values),
            });

            if (res.ok) {
                setLoading(false);
                toast.success(`Collection ${initialData ? 'Updated' : 'Created'}`);
                window.location.href = '/collections';
                router.push('/collections');
            }
        } catch (error) {
            console.log('Collection_POST', error);
            toast.error('Something went wrong! Please Try Again.');
        }
    };

    return loading ? (
        <Loader />
    ) : (
        <div className='sm:px-8 px-2 py-10'>
            {initialData ? (
                <div className='flex items-center justify-between'>
                    <p className='sm:text-heading2-bold text-heading3-bold'>Edit Collection</p>
                    <Delete id={initialData._id} item='collections' />
                </div>
            ) : (
                <p className='sm:text-heading2-bold text-heading3-bold'>Create Collection</p>
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
                                <FormMessage />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Image Uploaded */}
                    <FormField
                        control={form.control}
                        name='image'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex gap-10'>
                        <Button type='submit'>Submit</Button>
                        <Button
                            type='button'
                            onClick={() => router.push('/collections')}
                            variant='destructive'>
                            Discard
                        </Button>
                    </div>
                </Form>
            </form>
        </div>
    );
};

export default CollectionForm;
