import express from "express";
import unidadRoutes from "./routes/unidadRoutes.js";
import createCrudRouter from "./routes/createCrudRouter.js";
import huespedService from "./services/HuespedService.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import direccionRoutes from "./routes/direccionRoutes.js";
import pagoService from "./services/PagoService.js";
import resenaService from "./services/ResenaService.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api/unidades", unidadRoutes);
app.use("/api/huespedes", createCrudRouter(huespedService));
app.use("/api/reservas", reservaRoutes);
app.use("/api/direcciones", direccionRoutes);
app.use("/api/pagos", createCrudRouter(pagoService));
app.use("/api/resenas", createCrudRouter(resenaService));
app.use(notFoundHandler);
app.use(errorHandler);
export default app;

