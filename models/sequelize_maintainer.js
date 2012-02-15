(function() {
  var Article, Comment, Sequelize, User, a, a10, a11, a12, a13, a14, a2, a3, a4, a5, a6, a7, a8, a9, c, c2, chainer, chainer1, crypto, secure_with_salt, seq, u, u2;
  Sequelize = require('sequelize');
  chainer = new Sequelize.Utils.QueryChainer;
  chainer1 = new Sequelize.Utils.QueryChainer;
  crypto = require('crypto');
  seq = new Sequelize('blog', 'root', '', {
    host: 'localhost',
    port: 3306
  });
  secure_with_salt = function(pwd, salt) {
    return crypto.createHmac('sha256', salt).update(pwd).digest('hex');
  };
  User = seq["import"](__dirname + '/template/user_seq_template');
  Article = seq["import"](__dirname + '/template/article_seq_template');
  Comment = seq["import"](__dirname + '/template/comment_seq_template');
  User.hasMany(Article, {
    as: 'articles'
  });
  Article.hasMany(Comment, {
    as: 'comments'
  });
  /chainer.add(User.sync({force:true})).add(Article.sync({force:true})).add(Comment.sync({force:true}))chainer.runSerially().on('success',()->).on('error',()->)/;
  u = User.build({
    name: 'lay zhu',
    email: 'thunderzhulei@gmail.com',
    password: secure_with_salt('asdf', 'thunderzhulei@gmail.com'),
    status: 'nothing'
  });
  u2 = User.build({
    name: 'test user',
    email: 'testu@gmail.com',
    password: secure_with_salt('asdf', 'testu@gmail.com'),
    status: 'yet other'
  });
  c = Comment.build({
    body: 'try this one in thread'
  });
  c2 = Comment.build({
    body: 'suck it up'
  });
  a = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a2 = Article.build({
    title: 'serious article',
    body: 'no shit'
  });
  a3 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a4 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a5 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a6 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a7 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a8 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a9 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a10 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a11 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a12 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a13 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  a14 = Article.build({
    title: 'welcome',
    body: 'welcome everyone, here is first article'
  });
  chainer1.add(u.save()).add(u2.save()).add(a.save()).add(a2.save()).add(a3.save()).add(a4.save()).add(a5.save()).add(a6.save()).add(a7.save()).add(a8.save()).add(a9.save()).add(a10.save()).add(a11.save()).add(a12.save()).add(a13.save()).add(a14.save()).add(c.save()).add(c2.save()).add(u.setArticles([a])).add(u.setArticles([a3])).add(u.setArticles([a4])).add(u.setArticles([a5])).add(u.setArticles([a6])).add(u.setArticles([a7])).add(u.setArticles([a8])).add(u.setArticles([a9])).add(u.setArticles([a10])).add(u.setArticles([a11])).add(u.setArticles([a12])).add(u.setArticles([a13])).add(u.setArticles([a14])).add(u2.setArticles([a2])).add(a.setComments([c, c2]));
  chainer1.run().on('success', function() {}).on('error', function() {});
}).call(this);
