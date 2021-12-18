
const songsRouter = require('./songs');
const usersRouter = require('./users');
const playListsRouTer = require('./playLists')

function route(app) {
  
  app.use('/users', usersRouter);
  app.use('/songs', songsRouter);
  app.use('/playLists', playListsRouTer);
  
}

module.exports = route;
