import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import recipeRoutes from "./src/routes/recipeRoutes.js";
import cors from "cors";

dotenv.config();

connectDB();

app.use(cors());

const app=express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/users",userRoutes );
app.use("/api/recipes", recipeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
    
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});