express = require 'express'
express-namespace = require 'express-namespace'
stylus = require 'stylus'
RedisStore = require('connect-redis')(express)
MemoryStore = require('connect').session.MemoryStore
seq = new (require('sequelize'))('blog', 'root', '', {host: 'localhost', port: '3306'})

# Module
UserProvider = new (require('models/UserProvider'))(seq)
ArticleProvider = new (require('models/ArticleProvider'))(seq)

# Models
article = new (require('models/dummy/Article'))

# Export Server
app = module.exports = express.createServer()
# Configuration

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
  app.use stylus.middleware({src:__dirname + '/public'})
  app.dynamicHelpers {messages: require('express-messages')}

app.configure 'development', ()->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })
  app.use express.logger(':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

app.configure 'production', ()->
  app.use express.errorHandler()

# Routers

app.get '/', (req, res)->
  # init req.session.user to null anyway
  console.log req.session
  ArticleProvider.findArticlesByUserId '12', (error, as)->
    console.log as
    res.render 'index', {title: 'welcome', user: null, articles: as}


app.namespace '/user', ()->
  app.get '/', (req, res)->
    res.render 'user', {title: 'welcome', user: req.session.user}

  app.post '/login', (req, res)->
    UserProvider.authenticate req.body.email, req.body.password, (error, u)->
      if error
        req.flash 'error', error
        res.render 'index', {title: 'welcome', user: null}
      else if u
        req.session.user = u
        res.render 'user', {title: 'welcome', user: req.session.user}
        #res.redirect '/user'
   
   app.get '/logout', (req, res)->
      #req.session = {user: null}
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
  app.get '/', (req, res)->
    console.log req.session
    u = req.session.user
    ArticleProvider.findArticlesByUserId u.id, (error, articles)->
      if articles
        res.render 'blog.jade', {title: 'personal list', articles: articles}



app.listen 3000

console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
