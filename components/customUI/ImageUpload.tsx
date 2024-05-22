import React from 'react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, onRemove, value }) => {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    return (
        <div>
            <div className='mb-4 flex flex-wrap items-center gap-4'>
                {value.map((url) => (
                    <div key={url} className='relative w-[200px] h-[200px]'>
                        <div className='absolute top-1 right-1 z-10'>
                           <Button type='button' className='bg-red-1 hover:bg-red-1/90 h-[40px] w-[40px] p-0 flex items-center rounded-full'>
                                <Trash className='text-white font-bold h-5 w-5' />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            width={200}
                            height={200}
                            alt='collection'
                            className='object-cover rounded-lg border'
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget uploadPreset='dut55tpv' onUpload={onUpload}>
                {({ open }) => {
                    return (
                        <Button
                            onClick={() => open()}
                            type='button'
                            className='bg-grey-1 hover:bg-grey-1/80 text-white'>
                            <Plus className='h-4 w-4 mr-2' />
                            Upload Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;
