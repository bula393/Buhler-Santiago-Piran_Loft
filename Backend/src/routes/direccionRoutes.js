import { Router } from "express";
import { buscarDirecciones } from "../services/DireccionService.js";
import { successResponse } from "../responses/ApiResponse.js";

const router = Router();
router.get("/", async (req, res, next) => {
    try { res.json(successResponse(await buscarDirecciones(req.query.q))); }
    catch (error) { next(error); }
});
export default router;
