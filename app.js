(function() {
  var ArticleProvider, CommentProvider, MemoryStore, RedisStore, UserProvider, app, article, buildUser, express, namespace, seq, stylus;

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

  buildUser = function(isAuth, email, name, id) {
    if (isAuth) {
      return {
        email: email,
        name: name,
        id: id
      };
    } else {
      return null;
    }
  };

  app.get('/bio', function(req, res) {
    return res.render('bio', {
      title: 'Biography',
      user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
    });
  });

  app.namespace('/', function() {
    app.get('/', function(req, res) {
      if (!req.session || !req.session.isAuth) {
        req.session.isAuth = false;
        req.session.user_email = null;
        req.session.user_name = null;
        req.session.user_id = null;
      }
      return ArticleProvider.findArticlesBriefAllByPage(0, 10, function(error, as) {
        return ArticleProvider.countAll(function(error, c) {
          return res.render('index', {
            title: 'welcome',
            user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id),
            articles: as,
            page: 1,
            count: c
          });
        });
      });
    });
    return app.get('/p/:page', function(req, res) {
      return ArticleProvider.findArticlesBriefAllByPage(10 * (parseInt(req.params.page) - 1), 10 * (parseInt(req.params.page)), function(error, articles) {
        return ArticleProvider.countAll(function(error, c) {
          return res.render('index', {
            title: 'welcome',
            user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id),
            articles: articles,
            page: req.params.page,
            count: c
          });
        });
      });
    });
  });

  app.namespace('/user', function() {
    app.get('/', function(req, res) {
      console.log(req.session);
      return res.render('user', {
        title: 'welcome',
        user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
      });
    });
    app.post('/login', function(req, res) {
      console.log(req.body.current_url);
      return UserProvider.authenticate(req.body.email, req.body.password, function(error, u) {
        if (error) {
          req.flash('error', error);
        } else if (u) {
          req.session.isAuth = true;
          req.session.user_email = u.email;
          req.session.user_name = u.name;
          req.session.user_id = u.id;
          console.log(req.session);
        }
        return res.redirect(req.body.current_url);
      });
    });
    app.get('/logout', function(req, res) {
      req.session.isAuth = false;
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
      return ArticleProvider.findArticlesBriefByUserId('7', function(error, articles) {
        if (articles) {
          return res.render('blog', {
            title: 'personal list',
            articles: articles,
            user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
          });
        }
      });
    });
    app.get('/edit/:id', function(req, res) {
      return ArticleProvider.findArticleById(req.params.id, function(error, article) {
        return res.render('blog_edit', {
          title: 'Edit Blog',
          article: article,
          user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
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
        title: 'Add New Blog',
        user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
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
        console.log(article.body);
        return CommentProvider.findCommentsByArticleId(article.id, function(error, comments) {
          return res.render('blog_single', {
            title: 'Single Blog',
            article: article,
            comments: comments,
            user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
          });
        });
      });
    });
  });

  app.listen(3000);

  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

}).call(this);
