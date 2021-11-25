const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const sortMiddleware = require('./app/middlewares/sortMiddleware');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3006');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//Connect to db
db.connect();

//setup resource routes
app.use(express.static(path.join(__dirname, 'public')));

//parse data to body (post)
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

app.use(methodOverride('_method'));

//custom middleware
app.use(sortMiddleware);

//HTTP logger
// app.use(morgan('combined'));

//Template Engine
app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));



//route init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
