import express from "express";
import unidadRoutes from "./routes/unidadRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api/unidades", unidadRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
export default app;

