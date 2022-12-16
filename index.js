import express from "express";
import { initServer, emit } from "./socket.js";
import http from "http";
import bodyParser from "body-parser";
import { login, products } from './routes/index.js';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import handlebars from 'express-handlebars';
import passport from 'passport';
import { Strategy as LocalStrategy } from "passport-local";
import * as strategy from './passport/strat.js';
import { User } from './models/user.js';
import * as dotenv from 'dotenv';
dotenv.config()
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cookieParser())
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
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
app.engine("hbs", handlebars.engine({ extname: ".hbs", defaultLayout:"main.hbs"}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("./static"));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', login);
app.use('/api', products);


passport.use('login', new LocalStrategy({ passReqToCallback: true }, strategy.login));
passport.use('signup', new LocalStrategy({ passReqToCallback: true }, strategy.signUp));

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