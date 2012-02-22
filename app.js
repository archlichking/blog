(function() {
  var ARTICLE_ATTR, ArticleProvider, COMMENT_ATTR, CommentProvider, ITEM_PER_PAGE, MemoryStore, RedisStore, UserProvider, app, article, buildUser, express, filtCircularObject, namespace, seq, stylus;

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

  ITEM_PER_PAGE = 10;

  ARTICLE_ATTR = ['title', 'body', 'id', 'createdAt', 'updatedAt', 'userId', 'commentTimes', 'readTimes'];

  COMMENT_ATTR = ['id', 'body', 'createdAt', 'updatedAt', 'articleId'];

  filtCircularObject = function(objects, keys) {
    var key, obj, object, ret, _i, _j, _len, _len2;
    ret = [];
    obj = {};
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      for (_j = 0, _len2 = keys.length; _j < _len2; _j++) {
        key = keys[_j];
        obj[key] = object[key];
      }
      ret.push(obj);
      obj = {};
    }
    return ret;
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
      return ArticleProvider.findArticlesBriefAllByPage(0, ITEM_PER_PAGE, function(error, as) {
        var filteredArticles;
        filteredArticles = filtCircularObject(as, ARTICLE_ATTR);
        console.log(filteredArticles);
        return ArticleProvider.countAll(function(error, c) {
          return res.render('index', {
            title: 'welcome',
            user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id),
            articles: filteredArticles,
            next_page: 2,
            total_page: parseInt(c / 10 + 1)
          });
        });
      });
    });
    return app.get('/p/:page', function(req, res) {
      return ArticleProvider.findArticlesBriefAllByPage(10 * (parseInt(req.params.page) - 1), ITEM_PER_PAGE, function(error, articles) {
        var filteredArticles;
        filteredArticles = filtCircularObject(articles, ARTICLE_ATTR);
        if (article && articles.length !== 0) {
          return res.json({
            articles: filteredArticles,
            next_page: parseInt(req.params.page) + 1
          });
        } else {
          return res.json({
            articles: null,
            next_page: req.params.page
          });
        }
      });
    });
  });

  app.namespace('/user', function() {
    app.get('/', function(req, res) {
      return res.render('user', {
        title: 'welcome',
        user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
      });
    });
    app.post('/login', function(req, res) {
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
    app.get('/search/:query/p/:page', function(req, res) {
      return ArticleProvider.findArticleByTitlePage(req.params.query, 10 * (parseInt(req.params.page) - 1), ITEM_PER_PAGE, function(error, articles) {
        var filteredArticles;
        if (articles && articles.length !== 0) {
          filteredArticles = filtCircularObject(articles, ARTICLE_ATTR);
          return res.json({
            articles: filteredArticles,
            next_page: parseInt(req.params.page) + 1
          });
        } else {
          return res.json({
            articles: null,
            next_page: req.params.page
          });
        }
      });
    });
    app.post('/search', function(req, res) {
      return ArticleProvider.findArticleByTitlePage(req.body.query, 10 * (parseInt(req.body.page) - 1), ITEM_PER_PAGE, function(error, articles) {
        return ArticleProvider.countAllByTitle(req.body.query, function(error, c) {
          return res.render('blog/search', {
            title: 'search',
            query: req.body.query,
            articles: articles,
            next_page: parseInt(req.body.page) + 1,
            total_page: parseInt(c / 10 + 1),
            user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
          });
        });
      });
    });
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
        return res.render('blog/edit', {
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
      return res.render('blog/new', {
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
    return app.get('/:id', function(req, res) {
      return ArticleProvider.findArticleById(req.params.id, function(error, article) {
        return CommentProvider.findCommentsByArticleId(0, 10, article.id, function(error, comments) {
          return CommentProvider.countAllByArticleId(req.params.id, function(error, c) {
            return res.render('blog/single', {
              title: 'Single Blog',
              article: article,
              comments: comments,
              next_page: 2,
              total_page: parseInt(c / 10 + 1),
              user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)
            });
          });
        });
      });
    });
  });

  app.namespace('/comment', function() {
    app.get('/:aid/p/:page', function(req, res) {
      return CommentProvider.findCommentsByArticleId(10 * (parseInt(req.params.page) - 1), ITEM_PER_PAGE, req.params.aid, function(error, comments) {
        var filteredComments;
        if (comments.length !== 0) {
          filteredComments = filtCircularObject(comments, COMMENT_ATTR);
          return res.json({
            comments: filteredComments,
            next_page: parseInt(req.params.page) + 1
          });
        } else {
          return res.json({
            comments: null,
            next_page: req.params.page
          });
        }
      });
    });
    return app.post('/:aid', function(req, res) {
      return CommentProvider.addComment(req.body.comment_body, req.params.aid, function(error, comment) {
        if (error) {
          req.flash('error', error);
        } else {
          req.flash('info', 'Comment Added');
        }
        return res.redirect('/blog/' + req.params.aid);
      });
    });
  });

  app.namespace('/category', function() {
    return app.get('/:ctype/:time', function(req, res) {
      return ArticleProvider.findArticleByTime(req.params.time, function(error, articles) {
        var filteredArticles;
        if (articles && articles.length !== 0) {
          filteredArticles = filtCircularObject(articles, ['id', 'createdAt', 'title']);
          return res.json({
            articles: filteredArticles
          });
        } else {
          return res.json({
            articles: null
          });
        }
      });
    });
  });

  app.listen(3000);

  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

}).call(this);
