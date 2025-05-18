import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Box, CircleDollarSignIcon, ShoppingBag, Users } from 'lucide-react';

import {
  getTotalSales,
  getSalesPerMonth,
  getTotalCustomers,
  getTotalProducts,
} from '@/lib/actions';
import SalesChart from '@/components/customUI/SalesChart';
import Counter from '@/components/ui/counter';

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data: any) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data: any) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();
  const totalProducts = await getTotalProducts();
  const graphData = await getSalesPerMonth();

  return (
    <div className='sm:px-8 px-2 py-5'>
      <h2 className='text-heading2-bold py-5'>Dashboard</h2>

      <div className='flex gap-4 flex-wrap'>
        <CounterCard
          color='text-blue-600'
          heading='Total Revenue'
          count={totalRevenue}
          svg={<CircleDollarSignIcon size={28} />}
        />
        <CounterCard
          color='text-pink-600'
          heading='Total Orders'
          count={totalOrders}
          svg={<ShoppingBag size={28} />}
        />
        <CounterCard
          color='text-indigo-600'
          heading='Total Customer'
          count={totalCustomers}
          svg={<Users size={28} />}
        />
        <CounterCard
          color='text-yellow-600'
          heading='Total Products'
          count={totalProducts}
          svg={<Box size={28} />}
        />
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
  );
}

export const dynamic = 'force-dynamic';

type CounterCardProp = {
  heading: string;
  count: number;
  svg: React.ReactNode;
  color: string;
};

const CounterCard: React.FC<CounterCardProp> = ({ heading, count, svg, color }) => {
  return (
    <div className='p-6 rounded-lg border flex-1'>
      <div className='flex justify-between items-center'>
        <div className='space-y-3'>
          <h1 className='text-base-bold text-nowrap'>{heading}</h1>
          <h3 className='text-heading2-bold'>
            <Counter target={count} />
          </h3>
          {/* <p className='text-green-500 text-small-bold'>
            +<Counter target={12} />% from last month
          </p> */}
        </div>
        <div className={`${color}`}>{svg}</div>
      </div>
    </div>
  );
};
