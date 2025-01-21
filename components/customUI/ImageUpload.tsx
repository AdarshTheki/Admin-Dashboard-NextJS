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
    <>
      <div className='mb-4 flex flex-wrap items-center gap-4 w-full'>
        {value.map((url) => (
          <div key={url} className='relative '>
            <button
              onClick={() => onRemove(url)}
              type='button'
              className='absolute bg-red-600 top-1 right-1 z-10 rounded-full w-10 hover:opacity-95 hover:scale-95 duration-300 h-10 items-center flex justify-center'>
              <Trash className='text-white' />
            </button>
            <Image
              src={url || '/placeholder.jpg'}
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
            <Button onClick={() => open()} type='button'>
              <Plus className='h-4 w-4 mr-2' />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default ImageUpload;
