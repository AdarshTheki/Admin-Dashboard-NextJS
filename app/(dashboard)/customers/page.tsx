import { DataTable } from '@/components/customUI/DataTable';
import { Separator } from '@/components/ui/separator';
import { columns } from '@/components/customers/customerColumns';
import Customer from '@/models/Customer';
import { connectToDB } from '@/lib/mongoDB';

const CustomerPage = async () => {
    await connectToDB();
    const customers = await Customer.find().exec();

    return (
        <div className='sm:px-8 px-2 py-10'>
            <p className='sm:text-heading2-bold text-heading3-bold'>Customers</p>
            <Separator className='bg-grey-2 my-5' />
            <DataTable columns={columns} data={customers} searchKey='name' />
        </div>
    );
};

export const dynamic = 'force-dynamic';

export default CustomerPage;
