Sequelize = require 'sequelize'
chainer = new Sequelize.Utils.QueryChainer
chainer1 = new Sequelize.Utils.QueryChainer
crypto = require 'crypto'

seq = new Sequelize 'blog', 'root', '', {host: 'localhost', port: 3306}

secure_with_salt= (pwd, salt)->
  # secure user password with salt (by default, email)
  crypto.createHmac('sha256', salt).update(pwd).digest('hex')

# initialize data model
User = seq.import __dirname + '/template/user_seq_template'
Article = seq.import __dirname + '/template/article_seq_template'
Comment = seq.import __dirname + '/template/comment_seq_template'

User.hasMany Article, {as: 'articles'}
Article.hasMany Comment, {as: 'comments'}
# create tables
///
chainer
  .add(User.sync({force: true}))
  .add(Article.sync({force: true}))
  .add(Comment.sync({force: true}))

chainer
  .runSerially()
  .on('success', ()->
      )
  .on('error', ()->
      )
///
u = User.build {
  name: 'lay zhu',
  email: 'thunderzhulei@gmail.com',
  password: secure_with_salt('asdf', 'thunderzhulei@gmail.com')
  status: 'nothing'
}

u2 = User.build {
  name: 'test user',
  email: 'testu@gmail.com',
  password: secure_with_salt('asdf', 'testu@gmail.com'),
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

chainer1
  .add(u.save())
  .add(u2.save())
  .add(a.save())
  .add(a2.save())
  .add(c.save())
  .add(c2.save())
  .add(u.setArticles([a]))
  .add(u2.setArticles([a2]))
  .add(a.setComments([c, c2]))

chainer1
  .runSerially()
  .on('success', ()->
      )
  .on('error', ()->
      )
