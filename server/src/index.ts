import cors from "cors";
import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { createApiRouter } from "./api/routes";
import { loadConfig } from "./config/env";
import { RuntimeHttpError } from "./runtime/errors";

const config = loadConfig();
const app = express();

app.use(cors());
app.use(express.json());
app.use(createApiRouter());

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  const statusCode = error instanceof RuntimeHttpError ? error.statusCode : 500;

  response.status(statusCode).json({
    error: {
      message: error.message || "Unexpected server error."
    }
  });
});

app.listen(config.port, () => {
  console.log(`Inkbranch server listening on http://localhost:${config.port}`);
});
