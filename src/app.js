import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Adjust this to your frontend's URL
    credentials: true, // Allow cookies to be sent
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);

import garbageRoutes from "./routes/garbage.routes.js";
app.use("/api/v1/garbage", garbageRoutes);

import contactRouter from "./routes/contact.routes.js";
app.use("/api/v1/contact", contactRouter);

export { app };
