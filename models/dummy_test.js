(function() {
  var Article, Comment, User, dummy_article, dummy_comment, dummy_user;

  User = require('./User');

  Article = require('./Article');

  Comment = require('./Comment');

  dummy_user = new User();

  dummy_article = new Article();

  dummy_comment = new Comment();

  dummy_user.findUserById(1, function(error, u) {
    return console.log(u);
  });

  dummy_comment.findCommentsByArticleId(1, function(error, c) {
    return console.log(c);
  });

  dummy_article.findArticleById(1, function(error, a) {
    return console.log(a);
  });

  dummy_article.findAll(function(error, a) {
    return console.log(a);
  });

  dummy_article.findArticleByTitle('welcome', function(error, a) {
    return console.log(a.body);
  });

  dummy_article.findArticleByOwnerId(1, function(error, a) {
    return console.log(a.length);
  });

}).call(this);
