(function() {
  var ArticleProvider, CommentProvider, MemoryStore, RedisStore, UserProvider, app, article, express, namespace, seq, stylus;
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
  CommentProvider = new (require('models/CommentProvider'))(seq);
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
    return ArticleProvider.findArticlesBriefAll(function(error, as) {
      var article, _i, _len;
      for (_i = 0, _len = as.length; _i < _len; _i++) {
        article = as[_i];
        CommentProvider.getCommentsNumberByArticleId(article.id, function(error, c) {
          return article.comment_amount = c;
        });
      }
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
          return res.redirect('/');
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
    app.get('/', function(req, res) {
      console.log(req.session);
      return ArticleProvider.findArticlesBriefByUserId('14', function(error, articles) {
        if (articles) {
          return res.render('blog', {
            title: 'personal list',
            articles: articles
          });
        }
      });
    });
    app.get('/edit/:id', function(req, res) {
      return ArticleProvider.findArticleById(req.params.id, function(error, article) {
        return res.render('blog_edit', {
          title: 'Edit Blog',
          article: article
        });
      });
    });
    app.post('/edit/:id', function(req, res) {
      return ArticleProvider.updateArticle(req.params.id, req.body.blog_title, req.body.blog_body, function(error, article) {
        return res.redirect('/blog/' + req.params.id);
      });
    });
    app.get('/new', function(req, res) {
      return res.render('blog_new', {
        title: 'Add New Blog'
      });
    });
    app.post('/new', function(req, res) {
      return ArticleProvider.addArticle(req.body.blog_title, req.body.blog_body, '12', function(error, article) {
        if (error) {
          req.flash('error', error);
          return res.redirect('/blog/new');
        } else {
          req.flash('info', req.body.title + ' saved successfully');
          return res.redirect('/blog/' + article.id);
        }
      });
    });
    app.post('/comment', function(req, res) {
      return CommentProvider.addComment(req.body.comment_body, req.body.article_id, function(error, comment) {
        if (error) {
          req.flash('error', error);
        } else {
          req.flash('info', 'Comment Added');
        }
        return res.redirect('/blog/' + req.body.article_id);
      });
    });
    return app.get('/:id', function(req, res) {
      return ArticleProvider.findArticleById(req.params.id, function(error, article) {
        return CommentProvider.findCommentsByArticleId(article.id, function(error, comments) {
          return res.render('blog_single', {
            title: 'Single Blog',
            article: article,
            comments: comments
          });
        });
      });
    });
  });
  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}).call(this);
