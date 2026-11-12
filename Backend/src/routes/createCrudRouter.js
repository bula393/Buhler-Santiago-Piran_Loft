import { Router } from "express";
import { validateId } from "../middlewares/validateId.js";
import { successResponse } from "../responses/ApiResponse.js";

export default function createCrudRouter(service) {
    const router = Router();
    const responder = (operacion, status = 200) => (req, res, next) => {
        try { res.status(status).json(successResponse(operacion(req))); }
        catch (error) { next(error); }
    };
    router.get("/", responder(() => service.getAll()));
    router.get("/:id", validateId, responder((req) => service.getById(req.params.id)));
    router.post("/", responder((req) => service.create(req.body), 201));
    router.put("/:id", validateId, responder((req) => service.update(req.params.id, req.body)));
    router.delete("/:id", validateId, responder((req) => service.delete(req.params.id)));
    return router;
}
