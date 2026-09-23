import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { parsePositiveInteger } from "../utils/parseId.js";

export const validateId = (req, res, next) => {
    const id = parsePositiveInteger(req.params.id);
    if (id === null) {
        return next(new BadRequestError(Messages.INVALID_DATA));
    }

    req.params.id = id;
    next();
};
