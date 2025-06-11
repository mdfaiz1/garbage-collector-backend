import { app } from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("server is running on PORT", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection Failed", err);
  });
