Sequelize = require 'sequelize'
crypto = require 'crypto'

seq = new Sequelize 'blog', 'root', '', {host: 'localhost', port: 3306}

# initialize data model
User = seq.import __dirname + '/template/user_seq_template'
Article = seq.import __dirname + '/template/article_seq_template'
Comment = seq.import __dirname + '/template/comment_seq_template'

User.hasMany Article, {as: 'articles'}
Article.hasMany Comment, {as: 'comments'}

User.sync({force: true}).on 'success', ()->
  console.log "create table USERS successfully"

Comment.sync({force: true}).on 'success', ()->
  console.log "create table COMMENTSs successfully"

Article.sync({force: true}).on 'success', ()->
  console.log "create table ARTICLESS successfully"

u = User.build {
  name: 'lay zhu',
  email: 'thunderzhulei@gmail.com',
  password: 'asdf',
  status: 'nothing'
}

u2 = User.build {
  name: 'test user',
  email: 'testu@gmail.com',
  password: 'asdf',
  status: 'yet other'
}

c = Comment.build {
  body: 'try this one in thread'
}

c2 = Comment.build {
  body: 'suck it up'
}

a = Article.build {
  title: 'welcome',
  body: 'welcome everyone, here is first article'
}

a2 = Article.build {
  title: 'serious article'
  body: 'no shit'
}

u.save()
u2.save()
c.save()
c2.save()
a.save()
a2.save()

u.setArticles [a]
a.setComments [c, c2]
u2.setArticles [a2]
