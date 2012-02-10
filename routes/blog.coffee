Article = require 'models/dummy/Article'
article = new Article()

exports.single = (req, res)->
  article.findArticleById req.params.id, (error, arti)->
    res.render 'article_single', {title: arti.title, article: arti}

exports.all = (req, res)->
  article.findAll (error, artis)->
    res.render 'article_all', {title: 'top 10 articles', articles:artis}
