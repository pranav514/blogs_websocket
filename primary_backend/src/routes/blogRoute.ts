import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware";
import { isTemplateLiteralTypeNode } from "typescript";
const prisma = new PrismaClient();
const router = express.Router();
router.put("/update/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    console.log(userId);
    const blogId = req.params.id;
    console.log(blogId);
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
        authorId: userId,
      },
    });
    console.log(blog);
    if (!blog) {
      res.status(400).json({
        message: "blog not found",
      });
    }
    const blogUpdate = await prisma.blog.update({
      where: {
        id: blogId,
        authorId: userId,
      },
      data: {
        title,
        content,
      },
    });
    if (!blogUpdate) {
      res.status(400).json({
        message: "could not update the blog",
      });
    }
    res.status(200).json({
      message: "blog updated Succesfully",
      blog: blogUpdate,
    });
  } catch (error) {
    res.status(400).json({
      message: "error occured",
    });
  }
});

router.delete('/delete/:id' , async (req , res) => {
    const blogId = req.params.id;
    const userId = req.userId
    const blog = await prisma.blog.delete({
        where : {
            id : blogId,
            authorId : userId
        }
    })
    if(!blog){
        res.status(400).json({
            message : "could not delete the blog"
        })
    }
    res.status(200).json({
        message : "blog deleted successfully"
    })
})

export default router;
