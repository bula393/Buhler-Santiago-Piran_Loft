import AppError, { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { errorResponse } from "../responses/ApiResponse.js";

export const notFoundHandler = (req, res, next) => {
    next(new AppError(Messages.ROUTE_NOT_FOUND, 404));
};

export const errorHandler = (error, req, res, next) => {
    const normalizedError = error.status === 400
        ? new BadRequestError(Messages.INVALID_DATA)
        : error;
    const statusCode = normalizedError instanceof AppError
        ? normalizedError.statusCode
        : 500;
    const message = normalizedError instanceof AppError
        ? normalizedError.message
        : Messages.INTERNAL_SERVER_ERROR;

    if (statusCode >= 500) console.error(error);
    res.status(statusCode).json(errorResponse(message));
};
