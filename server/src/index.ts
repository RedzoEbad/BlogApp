import express from "express";
import router from './routes/TodoRoutes';
import connectDb from "./connection";
import cors from 'cors';

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors({
  origin: ["http://localhost", "http://localhost:3000"], 
  credentials: true
}));

connectDb();
app.use(express.json());
app.use("/api/v1", router);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});