const AppResponse = require('~/helpers/response');

const asyncUtil = (fn) =>
    function asyncUtilWrap(...args) {
        const fnReturn = fn(...args);
        const next = args[args.length - 1];
        const req = args[0];
        const res = args[1];
        return Promise.resolve(fnReturn).catch((error) => {
            AppResponse.fail(req, res)(null, 'Some error');
            return next(error);
        });
    };

module.exports = asyncUtil;
