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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const ws_1 = require("ws");
const router = express_1.default.Router();
router.post("/translation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wss = new ws_1.WebSocket("ws://localhost:8080");
        const { text, language } = req.body;
        const userId = req.params.id;
        if (!text || !language) {
            res.status(400).json({
                message: "enter the text and language",
            });
        }
        const user = yield prisma.user.findUnique({
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
        wss.send(JSON.stringify({
            type: "textSend",
            message: text,
            language,
        }));
        wss.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
            const message = JSON.parse(event.data.toString());
            if (message.type === "translatedText") {
                const blog = yield prisma.blog.create({
                    data: {
                        title: message.message.trans,
                        content: message.message.trans,
                        authorId: userId,
                    },
                });
                res.status(200).json({
                    message: "blog added to the database succesfully",
                    blog: blog,
                    language: language
                });
            }
        });
    }
    catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}));
exports.default = router;
