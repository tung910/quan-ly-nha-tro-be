module.exports = {
    success(req, res, status_code = 200) {
        return (data, message) => {
            const finalMessage = message || 'Successfully';
            const finalData = data || null;
            res.status(status_code).json({
                status_code,
                messages: finalMessage,
                result: {
                    data: finalData,
                },
            });
        };
    },
    fail(req, res, status_code = 500) {
        return (data, message) => {
            const finalMessage = message || 'Fail';
            const finalData = data || null;
            res.status(status_code).json({
                status_code,
                messages: finalMessage,
                result: {
                    data: finalData,
                },
            });
        };
    },
};
