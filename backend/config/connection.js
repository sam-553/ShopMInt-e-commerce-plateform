import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
const connectDb=async()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then((result) => {
        console.log("db conneted");
        
    }).catch((err) => {
        console.log(err.message);
        
    });
}
export default connectDb;


