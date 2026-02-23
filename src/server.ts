import "./config/env.js";

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";



const app = express();

app.use(cors());
app.use(express.json());

// 🔹 middleware
app.use(loggerMiddleware);
app.use(requestIdMiddleware);

// 🔹 routes
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({ status: "AI SDLC Assistant running" });
});

// 🔹 global error handler (останній!)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});