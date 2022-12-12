const { Router } = require("express")
const passport = require('passport');
const Auth = require('../middlewares/auth.js');

const login = Router();


login.get('/signup-error',(req, res)=>{
  res.render("signup-error", {});
})

login.get('/login-error',(req, res)=>{
  res.render("login-error", {});
})

login.get('/signup', (req, res) => {
  res.render('signup');
});

login.get('/logout', (req, res) => {
  const { user } = req.user;
  req.logout((err)=>{
    if(err)return err;
    res.render('logout', {user})
  })
})

login.get('/login', Auth, (req, res) => {
  res.render('login')
});

login.get('/', Auth, (req, res) => {
  res.render('login')
});

login.post("/login", passport.authenticate("login", { failureRedirect: "/login-error"})), (req,res) => {
  res.redirect("/")
};

login.post('/signup', passport.authenticate("signup", { failureRedirect: "/signup-error"}), (req, res) => {
  res.redirect("/")
})

module.exports = login