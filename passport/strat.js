const User = require('../models/user.js');
const bcrypt = require("bcrypt");

const validatePassword = (user, pass) => {
  return bcrypt.compareSync(pass, user.password);
};

const createHash = (pass) =>{
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};

const login = (req, user, password, cb) =>{
  User.findOne({ user: user }, (err, user) => {
    if(err) return cb(err);
    if(!user){
      console.log("No se encontró usuario");
      return cb(null, false);
    }
    return cb(null, user);
  });
};

const signUp = (req, user, password, cb) =>{
  User.findOne({ user: user }, (err, user) =>{
    if(err){
      console.log("Error al registrarse");
      return cb(err);
    };
    if(user){
      console.log("Ya existe el usuario");
      return cb(null, false);
    } else {
      const newUser = new User();
      newUser.user = user;
      newUser.password = createHash(password);
      newUser.save().then((datos) => cb(null, datos)).catch(null, false);
    }
  });
};

module.exports = { login, signUp };