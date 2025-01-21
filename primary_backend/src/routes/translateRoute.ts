import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
const prisma = new PrismaClient();
import { WebSocket } from "ws";
const router = express.Router();
interface Input {
  text: string;
  language: string;
}
router.post("/translation/:id", async (req: Request, res: Response) => {
  try {
    const wss = new WebSocket("ws://localhost:8080");

    const { text, language }: Input = req.body;
    const userId = req.params.id;
    if (!text || !language) {
      res.status(400).json({
        message: "enter the text and language",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "could not find the user",
      });
    }
    wss.onopen = () => {
      console.log("connection established");
    };
    wss.send(
      JSON.stringify({
        type: "textSend",
        message: text,
        language,
      })
    );
    wss.onmessage = async (event) => {
      const message = JSON.parse(event.data.toString());
      if (message.type === "translatedText") {
        const blog = await prisma.blog.create({
          data: {
            title: message.message.trans,
            content: message.message.trans,
            authorId: userId,
          },
        });
        res.status(200).json({
          message: "blog added to the database succesfully",
          blog: blog,
          language : language
        });
      }
    };
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

export default router;
