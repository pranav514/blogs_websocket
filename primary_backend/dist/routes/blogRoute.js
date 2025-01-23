"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.put("/update/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const userId = req.userId;
        console.log(userId);
        const blogId = req.params.id;
        console.log(blogId);
        const blog = yield prisma.blog.findUnique({
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
        const blogUpdate = yield prisma.blog.update({
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
    }
    catch (error) {
        res.status(400).json({
            message: "error occured",
        });
    }
}));
router.delete("/delete/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const userId = req.userId;
    const blog = yield prisma.blog.delete({
        where: {
            id: blogId,
            authorId: userId,
        },
    });
    if (!blog) {
        res.status(400).json({
            message: "could not delete the blog",
        });
    }
    res.status(200).json({
        message: "blog deleted successfully",
    });
}));
router.get("/getall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma.blog.findMany({ take: 10 });
    res.status(200).json({
        message: "blog fetched succesfully",
        blog: blog,
    });
}));
router.get("/getbyuser/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log(userId);
    const blog = yield prisma.blog.findMany({
        where: {
            authorId: userId,
        },
    });
    res.status(200).json({
        message: "blog fetched sucesfully for the specific user",
        blog: blog,
    });
}));
exports.default = router;
