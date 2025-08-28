import express from "express";
import router from './routes/TodoRoutes';
import connectDb from "./connection";
import cors from 'cors';

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());
connectDb();
app.use(express.json());
app.use("/api/v1", router);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});