const Auth=(req, res, next) =>{
  if(req.isAuth()) return res.render("home", { user: req.user.user});
  next();
}

module.exports = Auth