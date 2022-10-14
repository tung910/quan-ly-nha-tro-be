const validateRequest = (schema) => async (req, res, next) => {
    if (req.body.isUpdate) {
        return next();
    }
    const { error } = schema.validate(req.body.data);
    if (error) {
        throw new Error(error);
    }

    return next();
};

module.exports = validateRequest;
