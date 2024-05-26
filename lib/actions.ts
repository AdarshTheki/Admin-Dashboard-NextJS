import Customer from '@/models/Customer';
import Order from '@/models/Order';
import { connectToDB } from '@/lib/mongoDB';

export const getTotalSales = async () => {
    await connectToDB();
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    return { totalOrders, totalRevenue };
};

export const getTotalCustomers = async () => {
    await connectToDB();
    const customers = await Customer.find();
    const totalCustomer = customers.length;
    return totalCustomer;
};

export const getSalesPerMonth = async (date: string) => {
    await connectToDB();
    const orders = await Order.find();

    let monthIndexDate = (id: string) =>
        date === 'day' ? new Date(id).getDay() : new Date(id).getMonth();

    let monthDate = (id: number) =>
        date === 'day'
            ? new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
              }).format(new Date(0, 0, id))
            : new Intl.DateTimeFormat('en-US', {
                  month: 'short',
              }).format(new Date(0, id));

    const salesPerMonth = orders.reduce((acc, order) => {
        const monthIndex = monthIndexDate(order.createdAt); // 0 for Janruary --> 11 for December
        acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
        return acc;
    }, {});

    const graphData = Array.from({ length: 12 }, (_, i) => {
        const month = monthDate(i);
        return { name: month, sales: salesPerMonth[i] || 0 };
    });

    return graphData;
};
