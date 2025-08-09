import mongoose from "mongoose";

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/BlogApp")
        console.log("Database connected successfully");
    }
    catch(error){
       console.error("Database connection failed:", error); 
    }

}
export default connectDb;