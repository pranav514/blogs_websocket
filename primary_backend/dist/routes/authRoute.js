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
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstname, lastname } = req.body;
        console.log(email);
        console.log(password);
        console.log(firstname);
        console.log(lastname);
        if (!email || !password || !firstname || !lastname) {
            res.status(400).json({
                error: "Enter complete information",
            });
        }
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            error: "Could not register user. Please try again.",
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.json({
                error: "enter the email or password",
            });
        }
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            res.json({
                error: "user not found",
            });
        }
        if (password != (user === null || user === void 0 ? void 0 : user.password)) {
            res.json({
                error: "password not matched",
            });
        }
        let token = "";
        if (user) {
            token = (0, jsonwebtoken_1.sign)(user.id, "secret");
        }
        res.status(200).json({
            message: "user loged in succesfully",
            user: user,
            token: token,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error,
        });
    }
}));
exports.default = router;
