///
expors.single = (req, res)->
  article.findArticleById req.params.id, (error, arti)->
    res.render 'article_single', {title: arti.title, article: arti}

exports.all = (req, res)->
  article.findAll (error, artis)->
    res.render 'article_all', {title: 'top 10 articles', articles:artis}
///
app.namespace '/blog', ()->
  app.get '/', (req, res)->
    u = req.session.user
    articleProvider.findArticlesByUserId u.id, (error, articles)->
      if articles
        res.render 'blog.jade', {title: 'personal list', articles: articles}
