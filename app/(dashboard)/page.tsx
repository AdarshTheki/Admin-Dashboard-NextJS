import { Suspense } from 'react';
import { CircleDollarSign, ShoppingBag, UserRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { getTotalSales, getSalesPerMonth, getTotalCustomers } from '@/lib/actions';
import SalesChart from '@/components/customUI/SalesChart';

export default async function Home() {
    const totalRevenue = await getTotalSales().then((data: any) => data.totalRevenue);
    const totalOrders = await getTotalSales().then((data: any) => data.totalOrders);
    const totalCustomers = await getTotalCustomers();
    const graphData = await getSalesPerMonth('day');

    return (
        <Suspense
            fallback={<p className='text-center mt-20'>Loading Dashboard Data! Please wait...</p>}>
            <div className='sm:px-8 px-2 py-10'>
                <h2 className='text-heading2-bold'>Dashboard</h2>
                <Separator className='bg-grey-1 my-5' />

                <div className='grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10'>
                    <Card>
                        <CardHeader className='flex flex-row justify-between items-center'>
                            <CardTitle>Total Revenue</CardTitle>
                            <CircleDollarSign />
                        </CardHeader>
                        <CardContent>
                            <p className='text-body-bold'>
                                $ {Math.round(totalRevenue).toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='flex flex-row justify-between items-center'>
                            <CardTitle>Total Orders</CardTitle>
                            <ShoppingBag />
                        </CardHeader>
                        <CardContent>
                            <p className='text-body-bold'>{totalOrders}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='flex flex-row justify-between items-center'>
                            <CardTitle>Total Customer</CardTitle>
                            <UserRound />
                        </CardHeader>
                        <CardContent>
                            <p className='text-body-bold'>{totalCustomers}</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className='mt-10'>
                    <CardHeader>
                        <CardTitle>Sales Chart ($)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SalesChart data={graphData} />
                    </CardContent>
                </Card>
            </div>
        </Suspense>
    );
}

export const dynamic = 'force-dynamic';
