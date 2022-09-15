module.exports = {
    success(req, res) {
        return (data) => {
            const finalMessage = 'Successfully';
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
    fail(req, res) {
        return (data) => {
            const finalMessage = 'Fail';
            const finalData = data || null;
            res.status(500).json({
                status_code: 500,
                messages: finalMessage,
                result: {
                    data: finalData,
                },
            });
        };
    },
};
