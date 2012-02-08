(function() {
  var Article, article;
  Article = require('model/dummy/Article');
  article = new Article();
  exports.single = function(req, res) {
    return article.findArticleById(req.params.id, function(error, arti) {
      return res.render('article_single', {
        title: arti.title,
        article: arti
      });
    });
  };
  exports.all = function(req, res) {
    return article.findAll(function(error, artis) {
      return res.render('article_all', {
        title: 'top 10 articles',
        articles: artis
      });
    });
  };
}).call(this);
