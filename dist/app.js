"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const customer_1 = __importDefault(require("./routes/customer"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const order_1 = __importDefault(require("./routes/order"));
const productCategory_1 = __importDefault(require("./routes/productCategory"));
const supplier_1 = __importDefault(require("./routes/supplier"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const store_1 = __importDefault(require("./routes/store"));
const error_handler_1 = require("./utils/error-handler");
dotenv_1.default.config();
// import userRoutes from "./routes/userRoutes";
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// Mount the authentication routes
app.get("/", (req, res) => {
    res.send("Api is working");
});
app.use("/auth", auth_1.default);
app.use("/product", inventory_1.default);
app.use("/order", order_1.default);
app.use("/product-category", productCategory_1.default);
app.use("/supplier", supplier_1.default);
app.use("/customer", customer_1.default);
app.use("/dashboard", dashboard_1.default);
app.use("/store", store_1.default);
app.use((error, req, res, next) => {
    if (error instanceof error_handler_1.CustomError) {
        return res.status(error.statusCode).json(error.serializeError());
    }
    next(error);
});
// MongoDB Connection
const mongoURI = "mongodb+srv://Laxman9505:UhTMjAzyQWsqg8Ml@cluster0.djr7azy.mongodb.net/?retryWrites=true&w=majority" ||
    ""; // Replace 'mydatabase' with your actual database name
mongoose_1.default
    .connect(mongoURI)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
});
// Routes
// app.use("/users", userRoutes);
exports.default = app;
