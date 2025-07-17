import mongoose from "mongoose";
export const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "ITinventory"
    }).then(()=>{
        console.log(`Database connected successfully.`);
    }).catch(err=>{
        console.log(`Error connecting to database`, err);
    })
}