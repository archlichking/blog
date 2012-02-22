(function() {
  /expors.single=(req,res)->article.findArticleByIdreq.params.id,(error,arti)->res.render'article_single',{title:arti.title,article:arti}exports.all=(req,res)->article.findAll(error,artis)->res.render'article_all',{title:'top10articles',articles:artis}/;  app.namespace('/blog', function() {
    return app.get('/', function(req, res) {
      var u;
      u = req.session.user;
      return articleProvider.findArticlesByUserId(u.id, function(error, articles) {
        if (articles) {
          return res.render('blog.jade', {
            title: 'personal list',
            articles: articles
          });
        }
      });
    });
  });
}).call(this);
