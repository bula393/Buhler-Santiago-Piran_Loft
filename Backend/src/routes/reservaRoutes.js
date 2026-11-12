import { Router } from "express";
import createCrudRouter from "./createCrudRouter.js";
import reservaService from "../services/ReservaService.js";
import { crearReservaConPago } from "../services/ReservaCheckoutService.js";
import { successResponse } from "../responses/ApiResponse.js";

const router = Router();
router.post("/con-pago", (req, res, next) => {
    try { res.status(201).json(successResponse(crearReservaConPago(req.body))); }
    catch (error) { next(error); }
});
router.use(createCrudRouter(reservaService));
export default router;
