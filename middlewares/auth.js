 export const Authenticated =(req, res, next) =>{
  if(req.isAuthenticated()) return res.render("home", { user: req.user.user});
  next();
}

