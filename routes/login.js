const server = require("express").Router();

server.get('/login', (req, res) => {
  res.render('login.hbs');
});

server.post('/login', (req, res) => {
  let userName = req.body.name;
  req.session.name = userName;
  res.redirect('products')
});

server.get('/logout', (req, res) => {
  req.session.destroy((err) =>{
    if(!err){
      res.render("logout");
    } else res.send({ status: "Logout Error", body: err})
  })
})

module.exports = server