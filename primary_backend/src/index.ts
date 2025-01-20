import express from "express";
import authRoute from "./routes/authRoute";
import { authMiddleware } from "./middleware/authMiddleware";
import { Prisma } from "@prisma/client";
import translateRoute from "./routes/translateRoute";
const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/translate", translateRoute);
app.listen(3000, () => {
  console.log("connected to the localhost");
});
