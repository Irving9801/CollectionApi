import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";
import connectDB from "../config/db.js";
import productRoutes from "../routes/productRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import uploadRoutes from "../routes/uploadRoutes.js";
import fs1 from "fs";
import bodyParser1 from "body-parser";
import randomId from "random-id";
import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger.json');
const customCss = fs1.readFileSync(process.cwd() + "/swagger.css", "utf8");

dotenv.config();

connectDB();

const app = express(),
  bodyParser = bodyParser1,
  fs = fs1,
  port = 5000;

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

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send(`<h1>API Running on port ${port}</h1>`);
  });
}

app.use(notFound);
app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(
//   PORT,
//   console.log(
//     `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
//   )
// );

app.get("/api/todos", (req, res) => {
  console.log("api/todos called!!!!!");
  res.json(tasks);
});

app.post("/api/todo", (req, res) => {
  const task = req.body.task;
  task.id = randomId(10);
  tasks.push(task);
  res.json(tasks);
});

app.delete("/api/todo/:id", (req, res) => {
  console.log("Id to delete:::::", req.params.id);
  tasks = tasks.filter((task) => task.id != req.params.id);
  res.json(tasks);
});

app.put("/api/todos/:id", (req, res) => {
  console.log("Id to update:::::", req.params.id);
  const taskToUpdate = req.body.task;
  tasks = tasks.map((task) => {
    if (task.id == req.params.id) {
      task = taskToUpdate;
      task.id = parseInt(req.params.id);
    }
    return task;
  });
  res.json(tasks);
});

app.get("/", (req, res) => {
  res.send(`<h1>API Running on port ${port}</h1>`);
});

app.listen(port, () => {
  console.log(`Server listening on the port::::::${port}`);
});
