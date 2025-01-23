"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cors_1 = __importDefault(require("cors"));
const translateRoute_1 = __importDefault(require("./routes/translateRoute"));
const blogRoute_1 = __importDefault(require("./routes/blogRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/translate", translateRoute_1.default);
app.use("/api/v1/blog", blogRoute_1.default);
app.listen(3000, () => {
    console.log("connected to the localhost");
});
