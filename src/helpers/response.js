module.exports = {
    success(req, res) {
        return (data, message) => {
            const finalMessage = message || 'Successfully';
            const finalData = data || null;
            res.status(200).json({
                status_code: 200,
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
