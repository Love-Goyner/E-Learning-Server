const TryCatch = (handler) => {
    return async (res, req, next) => {
        try {
            await handler(res, req, next);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            })
        }
    }
}

export default TryCatch;