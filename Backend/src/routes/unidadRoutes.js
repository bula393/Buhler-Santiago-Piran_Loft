import { Router } from "express";
import unidadController from "../controllers/UnidadController.js";
import { validateId } from "../middlewares/validateId.js";

const router = Router();
router.get("/", unidadController.getAll);
router.get("/:id", validateId, unidadController.getById);
router.post("/", unidadController.create);
router.put("/:id", validateId, unidadController.update);
router.delete("/:id", validateId, unidadController.delete);
export default router;

