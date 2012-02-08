(function() {
  var app, blog, express, routes, stylus;
  express = require('express');
  routes = require('./routes');
  blog = require('./routes/blog');
  stylus = require('stylus');
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(stylus.middleware({
      src: __dirname + '/public'
    }));
    return app.use(app.router);
  });
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return app.use(express.logger({
      format: ':method :url'
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/blog/:id', blog.single);
  app.get('/', routes.index);
  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}).call(this);
