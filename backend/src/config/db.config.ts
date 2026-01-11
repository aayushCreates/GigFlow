import mongoose from 'mongoose';

const dbUri = process.env.DATABASE_URL;

const connectDB = async ()=> {
    await mongoose.connect(dbUri);
}


export default connectDB;