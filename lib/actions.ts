import Customer from '@/models/Customer';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { connectToDB } from '@/lib/mongoDB';

export const getTotalSales = async () => {
  await connectToDB();
  const orders = await Order.find();
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  return { totalOrders, totalRevenue };
};

export const getTotalProducts = async () => {
  await connectToDB();
  const products = await Product.countDocuments();
  return products;
};

export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find();
  const totalCustomer = customers.length;
  return totalCustomer;
};

export const getSalesPerMonth = async () => {
  await connectToDB();
  const orders = await Order.find();
  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // 0 for January --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // For June
    // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
    return acc;
  }, {});

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i));
    // if i === 5 => month = "Jun"
    return { name: month, sales: salesPerMonth[i] || 0 };
  });

  return graphData;
};
