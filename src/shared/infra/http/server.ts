import "reflect-metadata";
import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import swaggerUI from "swagger-ui-express";

import "@shared/container";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

createConnection();

const app = express();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(express.json());
app.use(cors());

app.use(router);
app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response
                .status(err.statusCode)
                .json({ message: err.message });
        }
        return response.status(500).json({
            status: "error",
            message: `Internal server error - ${err.message}`,
        });
    }
);

app.listen(3333, () => {
    console.log("aplicação rodando");
});
