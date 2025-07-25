import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import notesRoutes from "./routes/notes.route.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const __dirname = path.resolve();
// console.log(process.env.MONGO_URI);

//Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use(express.json()); // it parse json
app.use(rateLimiter);

//custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & req url is ${req.url}`);
//   next();
// });

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server is running on PORT : ", port);
  });
});
