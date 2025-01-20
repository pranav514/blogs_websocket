import express, { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, firstname, lastname }: User = req.body;

    if (!email || !password || !firstname || !lastname) {
      res.status(400).json({
        error: "Enter complete information",
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        firstname,
        lastname,
      },
    });

    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      error: "Could not register user. Please try again.",
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;
    if (!email || !password) {
      res.json({
        error: "enter the email or password",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.json({
        error: "user not found",
      });
    }
    if (password != user?.password) {
      res.json({
        error: "password not matched",
      });
    }
    let token = "";
    if (user) {
      token = sign(user.id, "secret");
    }

    res.status(200).json({
      message: "user loged in succesfully",
      user: user,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
});

export default router;
