const express = require("express");
const { initServer, emit } = require("./socket");
const http = require("http");
const bodyParser = require("body-parser");
const router = require('./routes/index.js')
const productsRouter = require('./routes/products.js')
const loginRouter = require('./routes/login.js')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const MongoStore = require('connect-mongo');
const advOpt = { useNewUrlParser: true, useUnifiedTopology: true };
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const strat = require('./passport/strat.js')

app.engine("hbs", handlebars.engine({ extname: ".hbs", defaultLayout:"main.hbs"}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("./static"));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', loginRouter);
app.use('/api', productsRouter);

app.use(cookieParser())
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: advOpt,
      ttl: 600,
    }),
    secret: "secreto",
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: 600000,
    },
  })
);

passport.use('login', new LocalStrategy({ passReqToCallback: true }, strat.login));
passport.use('signup', new LocalStrategy({ passReqToCallback: true }, strat.signUp));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});


app.use((error, req, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).send(`Error ${error.statusCode}`);
  }
  console.log(error);
  res.status(500).json({ error: "Error"});
});

const server = http.createServer(app);
initServer(server);

server.listen(PORT, () => {
  console.log("Server conectado en puerto " + PORT);
});