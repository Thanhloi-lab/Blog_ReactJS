const newsRouter = require('./news');
const siteRouter = require('./site');
const courseRouter = require('./courses');
const meRouter = require('./me');
const songsRouter = require('./songs');
const usersRouter = require('./users');

function route(app) {
  
  app.use('/users', usersRouter);
  app.use('/songs', songsRouter);
  app.use('/me', meRouter);
  app.use('/courses', courseRouter);
  app.use('/news', newsRouter);
  app.use('/', siteRouter);
}

module.exports = route;
