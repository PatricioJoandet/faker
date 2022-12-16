import { Router } from "express";
import passport from 'passport';
import { Authenticated, PassportAuth} from '../middlewares/index.js';
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

login.get('/login', Authenticated, (req, res) => {
  res.render('login')
});

login.get('/', Authenticated, (req, res) => {
  res.render('login')
});

login.post("/login", passport.authenticate("login", { failureRedirect: "/login-error"})), (req,res) => {
  res.redirect("/")
};

login.post('/signup', passport.authenticate("signup", { failureRedirect: "/signup-error"}), (req, res) => {
  res.redirect("/")
})

export default login;