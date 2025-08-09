import express from "express";
import router from './routes/TodoRoutes';
import connectDb from "./connection";

const app = express();

connectDb();
app.use(express.json());
app.use("/api", router);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});