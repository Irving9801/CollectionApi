import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import fs1 from "fs";
import bodyParser1 from "body-parser";
import randomId from "random-id";
import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json";
import { createRequire } from "module";
import cors from "cors";
// const cors = require("cors");
// var app = require('express')();
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger.json");
const customCss = fs1.readFileSync(process.cwd() + "/swagger.css", "utf8");
dotenv.config();

connectDB();

const app = express(),
  bodyParser = bodyParser1,
  fs = fs1,
  port = 5000;
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss })
);
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send(process.env.PAYPAL_CLIENT_ID);
});
app.get("/", (req, res) => {
  res.send(`<h1>API Running on port ${port}</h1>`);
});
app.get("/api/cors", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send({ msg: "This has CORS enabled 🎈" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${port} mode on port ${PORT}`.yellow.bold);
});
