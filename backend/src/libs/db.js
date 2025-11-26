import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('Lien ket DB thanh cong');
    } catch (error) {
        console.error('Loi ket noi DB:', error);
        process.exit(1);
    }
}