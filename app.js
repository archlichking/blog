(function() {
  var ArticleProvider, MemoryStore, RedisStore, UserProvider, app, article, express, namespace, seq, stylus;
  express = require('express');
  express - (namespace = require('express-namespace'));
  stylus = require('stylus');
  RedisStore = require('connect-redis')(express);
  MemoryStore = require('connect').session.MemoryStore;
  seq = new (require('sequelize'))('blog', 'root', '', {
    host: 'localhost',
    port: '3306'
  });
  UserProvider = new (require('models/UserProvider'))(seq);
  ArticleProvider = new (require('models/ArticleProvider'))(seq);
  article = new (require('models/dummy/Article'));
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'crazy lay',
      store: new RedisStore()
    }));
    app.use(app.router);
    app.use(express - namespace);
    app.use(express.static(__dirname + '/public'));
    app.use(stylus.middleware({
      src: __dirname + '/public'
    }));
    return app.dynamicHelpers({
      messages: require('express-messages')
    });
  });
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return app.use(express.logger(':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    console.log(req.session);
    return ArticleProvider.findArticlesByUserId('12', function(error, as) {
      console.log(as);
      return res.render('index', {
        title: 'welcome',
        user: null,
        articles: as
      });
    });
  });
  app.namespace('/user', function() {
    app.get('/', function(req, res) {
      return res.render('user', {
        title: 'welcome',
        user: req.session.user
      });
    });
    app.post('/login', function(req, res) {
      return UserProvider.authenticate(req.body.email, req.body.password, function(error, u) {
        if (error) {
          req.flash('error', error);
          return res.render('index', {
            title: 'welcome',
            user: null
          });
        } else if (u) {
          req.session.user = u;
          return res.render('user', {
            title: 'welcome',
            user: req.session.user
          });
        }
      });
    });
    app.get('/logout', function(req, res) {
      return res.redirect('/');
    });
    app.post('/register', function(req, res) {
      return register_params_validate(req, res, function(ret) {
        if (ret) {
          return res.render('index_reg', {
            title: 'welcome',
            user: null
          });
        } else {
          return UserProvider.findUserByEmail(req.body.email, function(error, u) {
            if (u) {
              req.flash('error', 'Email Aready Taken');
              return res.render('index_reg', {
                title: 'welcome',
                user: null
              });
            } else {
              return UserProvider.addUser(req.body.email, req.body.password, req.body.name, function(error, u) {
                if (error) {
                  req.flash('error', error);
                  return res.render('index_reg', {
                    title: 'welcome',
                    user: null
                  });
                } else if (u) {
                  req.session.user = u;
                  return res.render('user', {
                    title: 'welcome',
                    user: req.session.user
                  });
                }
              });
            }
          });
        }
      });
    });
    return app.get('register_redirect', function(req, res) {
      if (req.session && req.session.user) {
        return res.render('user', {
          title: 'welcome',
          user: req.session.user
        });
      } else {
        req.session.user = null;
        return res.render('index_reg', {
          title: 'welcome registeration'
        });
      }
    });
  });
  app.namespace('/blog', function() {
    return app.get('/', function(req, res) {
      var u;
      console.log(req.session);
      u = req.session.user;
      return ArticleProvider.findArticlesByUserId(u.id, function(error, articles) {
        if (articles) {
          return res.render('blog.jade', {
            title: 'personal list',
            articles: articles
          });
        }
      });
    });
  });
  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}).call(this);
