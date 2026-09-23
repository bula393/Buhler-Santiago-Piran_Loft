import unidadService from "../services/UnidadService.js";
import { successResponse } from "../responses/ApiResponse.js";

class UnidadController {
    getAll = (req, res, next) => {
        try {
            res.status(200).json(successResponse(unidadService.getAll()));
        } catch (error) {
            next(error);
        }
    };

    getById = (req, res, next) => {
        try {
            res.status(200).json(successResponse(unidadService.getById(req.params.id)));
        } catch (error) {
            next(error);
        }
    };

    create = (req, res, next) => {
        try {
            res.status(201).json(successResponse(unidadService.create(req.body)));
        } catch (error) {
            next(error);
        }
    };

    update = (req, res, next) => {
        try {
            res.status(200).json(successResponse(unidadService.update(req.params.id, req.body)));
        } catch (error) {
            next(error);
        }
    };

    delete = (req, res, next) => {
        try {
            res.status(200).json(successResponse(unidadService.delete(req.params.id)));
        } catch (error) {
            next(error);
        }
    };
}

export default new UnidadController();
