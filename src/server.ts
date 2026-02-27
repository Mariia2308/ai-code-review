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


app.use(requestIdMiddleware); // requestId має бути першим
app.use(loggerMiddleware);

app.get("/", (_req, res) => {
  res.json({ status: "AI SDLC Assistant running" });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/version", (_req, res) => {
  res.json({
    name: "AI SDLC Assistant",
    version: "1.2.0",
    mode: process.env.MOCK === "true" ? "mock" : "ai"
  });
});


app.use("/api", routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});