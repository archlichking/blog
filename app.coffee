express = require 'express'
routes = require './routes'
blog = require './routes/blog'
stylus = require 'stylus'
Sequelize = require 'sequelize'


app = module.exports = express.createServer()
seq = module.exports = new Sequelize 'blog', 'root', '', {host: 'localhost', port: '3306'}

# module
UserProvider = require './model/UserProvider'
console.log seq
userProvier = new UserProvider(seq)

# Configuration

app.configure ()->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static(__dirname + '/public')
  app.use stylus.middleware({src:__dirname + '/public'})
  app.use app.router

app.configure 'development', ()->
  app.use express.errorHandler { dumpExceptions: true, showStack: true }
  app.use express.logger({format: ':method :url'})

app.configure 'production', ()->
  app.use express.errorHandler()

# Routers

app.get '/blog/:id', blog.single

app.get '/', (req, res)->
  userProvider.findUserById 1, (error, u)->
    res.render 'index', {title: 'welcome', user: u}

app.get '/blog', blog.all

app.listen 3000

console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
