var { expressjwt } = require('express-jwt');

// module.exports = {
//     checkAuth: (req, res, next) => {
//         const isAdmin = true;
//         if (isAdmin) {
//             next();
//         } else {
//             res.redirect('/');
//         }
//     },
// };
module.exports = {
    requireSignin: expressJWT({
        secret: 'datn_tw13',
        algorithms: ['HS256'],
        requestProperty: 'auth',
    }),
    isAuth: (req, res, next) => {
        const user = req.profile._id == req.auth._id;
        if (!user) {
            return res.status(402).json({
                message: 'Bạn không được phép truy cập',
            });
        }
        next();
    },
    isAdmin: (req, res, next) => {
        if (req.profile.role == 0) {
            return res.status(401).json({
                message: 'Ban khong phai la admin',
            });
        }
        next();
    },
    checkAuth: (req, res, next) => {
        const isAdmin = true;
        if (isAdmin) {
            next();
        } else {
            res.redirect('/');
        }
    },
};

