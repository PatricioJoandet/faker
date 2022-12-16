import passport from 'passport';
import * as strategy from '../passport/strat.js'
import { User } from '../models/user.js';
import { Strategy as LocalStrategy } from 'passport-local';


const init = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });


passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(err, user);

  passport.use(
    "login",
    new LocalStrategy({
      passReqToCallback: true,
    },
    async (req, username, password, cb) => {
      await User.findOne( { user: username }, (err, user) => {
        if(err) return cb(err);
        if(!user){
          console.log(`Usuario ${username} no encontrado`)
          return cb(null, false);
        }
        if(!validatePassword(user, password)){
          console.log("Contraseña incorrecta");
          return cb(null, user);
        }
        return cb(null, user);
      });
    })
  );

  passport.use("signup",
    new LocalStrategy({
      passReqToCallback: true,
    },
    async (req, username, password, cb) => {
      await User.findOne({ user: username }, (err, user) => {
        if(err) {
          console.log(`Error al registrarse: ${err}`);
          return cb(err);
        }
        if(user){
          console.log("Usuario ya usado");
          return cb(null, false);
        } else {
          const newUser = new User();
          newUser.user = username;
          newUser.password = createHash(password);
          newUser.save().then((datos) => cb(null, datos)).catch(null, false);
        }
      });
    }
  ))
  });
};
export const PassportAuth = {
  init,
};