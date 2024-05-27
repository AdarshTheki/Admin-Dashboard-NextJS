import React, { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

interface DeleteProps {
    id: string;
    item: string;
}

const Delete: React.FC<DeleteProps> = ({ id, item }) => {
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);
            const itemType = item === 'product' ? 'products' : 'collections';
            const res = await fetch(`/api/${itemType}/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setLoading(false);
                window.location.href = `/${itemType}`;
                toast.success(`${item} deleted`);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something was wrong! Please try again');
        } finally {
            setLoading(false);
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button type='button' className='p-2 bg-red-1 text-base-medium text-white hover:bg-red-1/90 rounded-lg'>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className=' bg-white text-grey-1'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-red-1'>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your collection.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className=' text-grey-1 hover:bg-grey-2'>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className=' bg-red-1 text-white hover:bg-red-1/80'>
                        {loading ? 'Loading...' : 'Continue'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Delete;
