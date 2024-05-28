import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI + '/E-Commerce_Admin' || '');

        isConnected = true;
        console.log('MongoDB is connected');
    } catch (err) {
        console.log(err);
    }
};

export const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
