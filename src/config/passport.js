const passport = require('passport');
const localStratery = require('passport-local').Strategy;
const UserModel = require('../models/user.model');
const JwtStratery = require('passport-jwt').Strategy;

passport.use(
    new localStratery((name, password, done) => {
        UserModel.findOne({ name }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            user.comparePassword(passport, done);
        })
    })
)

const cookiesExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token;
}

passport.use(
    new JwtStratery({
        jwtFromRequest: cookiesExtractor,
        secretOrKey: "Van Vuong"
    }, (payload, done) => {
        UserModel.findById({ _id: payload.sub }, (err, user) => {
            if(err)return done(err,false);
            if(user) return done(null,user);
            else{
                return done(null,false)
            }
        })
    })
)