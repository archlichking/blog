express = require 'express'
express-namespace = require 'express-namespace'
stylus = require 'stylus'
RedisStore = require('connect-redis')(express)
MemoryStore = require('connect').session.MemoryStore
seq = new (require('sequelize'))('blog', 'root', '', {host: 'localhost', port: '3306'})

# ============Module
UserProvider = new (require('models/UserProvider'))(seq)
ArticleProvider = new (require('models/ArticleProvider'))(seq)
CommentProvider = new (require('models/CommentProvider'))(seq)

# ============Models
article = new (require('models/dummy/Article'))

# ============Export Server
app = module.exports = express.createServer()

# ============Configuration
app.configure ()->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  #app.use express.session({secret: 'crazy lay', store: new MemoryStore({reapInterval: 60000 * 10})})
  app.use express.session({secret: 'crazy lay', store: new RedisStore()})
  app.use app.router
  app.use express-namespace
  app.use express.static(__dirname + '/public')
  app.dynamicHelpers {messages: require('express-messages')}

app.configure 'development', ()->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })
  app.use express.logger(':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

app.configure 'production', ()->
  app.use express.errorHandler()

buildUser = (isAuth, email, name, id)->
  if isAuth then {email: email, name: name, id: id} else null

ITEM_PER_PAGE = 10

filtCircularObject = (objects, keys)->
  ret = []
  obj = {}
  for object in objects
    for key in keys
      obj[key] = object[key]
    ret.push obj
    obj = {}

  return ret

# ============Routers
# basic pages
app.get '/bio', (req, res)->
  res.render 'bio', {title: 'Biography', user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

# with namespace
app.namespace '/', ()->
  app.get '/', (req, res)->
    # init req.session.user to null anyway
    if not req.session || not req.session.isAuth
      req.session.isAuth = false
      req.session.user_email = null
      req.session.user_name = null
      req.session.user_id = null
    ArticleProvider.findArticlesBriefAllByPage 0, ITEM_PER_PAGE,  (error, as)->
      ArticleProvider.countAll (error, c)->
        res.render 'index', {title: 'welcome', user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id), articles: as, next_page: 2, total_page: parseInt(c/10+1)}
  
  app.get '/p/:page', (req, res)->
    # get particular page
    ArticleProvider.findArticlesBriefAllByPage 10*(parseInt(req.params.page)-1), ITEM_PER_PAGE, (error, articles)->
      filteredArticles = filtCircularObject articles, ['title', 'body', 'id', 'createdAt', 'updatedAt', 'USERId']
      if article && articles.length != 0
        res.json({articles: filteredArticles, next_page: parseInt(req.params.page)+1})
      else
        res.json({articles: null, next_page: req.params.page})


app.namespace '/user', ()->
  app.get '/', (req, res)->
    console.log req.session
    res.render 'user', {title: 'welcome', user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

  app.post '/login', (req, res)->
    UserProvider.authenticate req.body.email, req.body.password, (error, u)->
      if error
        req.flash 'error', error
      else if u
        # set session
        req.session.isAuth = true
        req.session.user_email = u.email
        req.session.user_name = u.name
        req.session.user_id = u.id
        console.log req.session
        #res.render 'user', {title: 'welcome', user: req.session.user}
      res.redirect req.body.current_url
   
  app.get '/logout', (req, res)->
    # clear session
    req.session.isAuth = false
    res.redirect '/'

  app.post '/register', (req, res)->
      register_params_validate req, res, (ret)->
        if ret
          res.render 'index_reg', {title: 'welcome', user: null}
        else
          UserProvider.findUserByEmail req.body.email, (error, u)->
            if u
              req.flash 'error', 'Email Aready Taken'
              res.render 'index_reg', {title: 'welcome', user: null}
            else 
              UserProvider.addUser req.body.email, req.body.password, req.body.name, (error, u)->
                if error
                   req.flash 'error', error
                   res.render 'index_reg', {title: 'welcome', user: null}
                else if u
                   req.session.user = u
                   res.render 'user', {title: 'welcome', user: req.session.user}

  app.get 'register_redirect', (req, res)->
    # session keeping
    if req.session and req.session.user
      res.render 'user', {title: 'welcome', user: req.session.user}
    else
      req.session.user = null
      res.render 'index_reg', {title: 'welcome registeration'}

app.namespace '/blog', ()->
  app.get '/search/:query/p/:page', (req, res)->
    ArticleProvider.findArticleByTitlePage req.params.query, 10*(parseInt(req.params.page)-1), ITEM_PER_PAGE, (error, articles)->
      if articles && articles.length !=0
        filteredArticles = filtCircularObject articles, ['title', 'body', 'id', 'createdAt', 'updatedAt', 'USERId']
        res.json({articles: filteredArticles, next_page: parseInt(req.params.page)+1})
      else
        res.json({articles: null, next_page: req.params.page})

  app.post '/search', (req, res)->
    ArticleProvider.findArticleByTitlePage req.body.query, 10*(parseInt(req.body.page)-1), ITEM_PER_PAGE, (error, articles)->
      ArticleProvider.countAllByTitle req.body.query, (error, c)->
        res.render 'blog/search', {title: 'search', query: req.body.query, articles: articles, next_page: parseInt(req.body.page)+1, total_page: parseInt(c/10+1), user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

  app.get '/', (req, res)->
    console.log req.session
    ArticleProvider.findArticlesBriefByUserId '7', (error, articles)->
      if articles
        res.render 'blog', {title: 'personal list', articles: articles, user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

  app.get '/edit/:id', (req, res)->
    ArticleProvider.findArticleById req.params.id, (error, article)->
      res.render 'blog/edit', {title: 'Edit Blog', article: article, user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

  app.post '/edit/:id', (req, res)->
    ArticleProvider.updateArticle req.params.id, req.body.blog_title, req.body.blog_body, (error, article)->
      res.redirect '/blog/' + req.params.id

  app.get '/new', (req, res)->
    res.render 'blog/new', {title: 'Add New Blog', user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

  app.post '/new', (req, res)->
    ArticleProvider.addArticle req.body.blog_title, req.body.blog_body, '12', (error, article)->
      if error
        req.flash 'error', error
        res.redirect '/blog/new'
      else
        req.flash 'info', req.body.title + ' saved successfully'
        res.redirect '/blog/'+ article.id
  
  app.get '/:id', (req, res)->
    ArticleProvider.findArticleById req.params.id, (error, article)->
      CommentProvider.findCommentsByArticleId 0, 10, article.id, (error, comments)->
        CommentProvider.countAllByArticleId req.params.id, (error, c)->
          res.render 'blog/single', {title: 'Single Blog', article: article, comments: comments, next_page: 2, total_page: parseInt(c/10+1), user: buildUser(req.session.isAuth, req.session.user_email, req.session.user_name, req.session.user_id)}

app.namespace '/comment', ()->
  app.get '/:aid/p/:page', (req, res)->
    CommentProvider.findCommentsByArticleId 10*(parseInt(req.params.page)-1), ITEM_PER_PAGE, req.params.aid, (error, comments)->
      if comments.length != 0
        filteredComments = filtCircularObject comments, ['id', 'body', 'createdAt', 'updatedAt', 'ARTICLEId']
        res.json {comments: filteredComments, next_page: parseInt(req.params.page)+1}
      else
        res.json {comments: null, next_page: req.params.page}


  app.post '/:aid', (req, res)->
    CommentProvider.addComment req.body.comment_body, req.params.aid, (error, comment)->
      if error
        req.flash 'error', error
      else
        req.flash 'info', 'Comment Added'
      res.redirect '/blog/' + req.params.aid

app.namespace '/category', ()->
  app.get '/:ctype/:time', (req, res)->
    ArticleProvider.findArticleByTime req.params.time, (error, articles)->
      if articles && articles.length != 0
        filteredArticles = filtCircularObject articles, ['id', 'createdAt', 'title']
        res.json {articles: filteredArticles}
      else
        res.json {articles: null}
          



app.listen 3000

console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
