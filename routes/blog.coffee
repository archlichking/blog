Article = require 'model/dummy/Article'
article = new Article()

exports.single = (req, res)->
  article.findArticleById req.params.id, (error, arti)->
    res.render 'article_single', {title: arti.title, article: arti}
