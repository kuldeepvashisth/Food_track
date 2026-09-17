import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const uri = process.env.mongodb_url?.trim().replace(/\s+/g, '');
        if (!uri) {
            throw new Error('mongodb_url is missing in environment variables');
        }

        await mongoose.connect(uri);
        console.log('mongoose connected successfully');
        return mongoose.connection;
    } catch (err) {
        console.log('error in connecting DataBase is ', err);
        throw err;
    }
};

export { connectDb };
