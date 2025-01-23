import express from "express";
import authRoute from "./routes/authRoute";
import { authMiddleware } from "./middleware/authMiddleware";
import { Prisma } from "@prisma/client";
import cors from "cors";
import translateRoute from "./routes/translateRoute";
import blogRoute from "./routes/blogRoute";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/translate", translateRoute);
app.use("/api/v1/blog", blogRoute);
app.listen(3000, () => {
  console.log("connected to the localhost");
});
