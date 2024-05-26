import { DataTable } from '@/components/customUI/DataTable';
import { Separator } from '@/components/ui/separator';
import { columns } from '@/components/customers/customerColumns';
import Customer from '@/models/Customer';
import { connectToDB } from '@/lib/mongoDB';

const CustomerPage = async () => {
    await connectToDB();
    const customers = await Customer.find().exec();

    return (
        <div className='px-10 py-5'>
            <p className='text-heading2-bold'>Customers</p>
            <Separator className='bg-grey-1 my-5' />
            <DataTable columns={columns} data={customers} searchKey='name' />
        </div>
    );
};

export const dynamic = 'force-dynamic';

export default CustomerPage;
