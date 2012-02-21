(function() {
  var ArticleProvider;

  ArticleProvider = (function() {

    function ArticleProvider(seq) {
      this.seq = seq;
      this.articleDao = this.seq["import"](__dirname + '/template/article_seq_template');
    }

    ArticleProvider.prototype.findArticleById = function(a_id, callback) {
      return this.articleDao.find({
        where: {
          id: a_id
        }
      }).on('success', function(a) {
        return callback(null, a);
      });
    };

    ArticleProvider.prototype.findArticlesByUserId = function(u_id, callback) {
      return this.articleDao.findAll({
        where: {
          userid: u_id
        },
        order: 'createdAt DESC',
        limit: 10
      }).on('success', function(as) {
        return callback(null, as);
      });
    };

    ArticleProvider.prototype.findArticlesBriefByUserId = function(u_id, callback) {
      return this.articleDao.findAll({
        where: {
          userid: u_id
        },
        order: 'createdAt DESC',
        limit: 10
      }).on('success', function(as) {
        var a, _i, _len;
        for (_i = 0, _len = as.length; _i < _len; _i++) {
          a = as[_i];
          if (a.body.length > 300) a.body = a.body.substring(0, 297) + '...';
        }
        return callback(null, as);
      });
    };

    ArticleProvider.prototype.findArticlesBriefAll = function(callback) {
      return this.articleDao.findAll({
        order: 'id DESC',
        limit: 10
      }).on('success', function(as) {
        var a, _i, _len;
        for (_i = 0, _len = as.length; _i < _len; _i++) {
          a = as[_i];
          if (a.body.length > 300) a.body = a.body.substring(0, 297) + '...';
        }
        return callback(null, as);
      });
    };

    ArticleProvider.prototype.findArticlesBriefAllByPage = function(start, amount, callback) {
      return this.articleDao.findAll({
        order: 'id DESC',
        limit: amount,
        offset: start
      }).on('success', function(articles) {
        var a, _i, _len;
        for (_i = 0, _len = articles.length; _i < _len; _i++) {
          a = articles[_i];
          if (a.body.length > 300) a.body = a.body.substring(0, 297) + '...';
        }
        return callback(null, articles);
      });
    };

    ArticleProvider.prototype.findArticleByTime = function(time, callback) {
      return this.articleDao.findAll({
        where: "createdAt like '%" + time + "%' ",
        attributes: ['id', 'createdAt', 'title']
      }).on('success', function(articles) {
        return callback(null, articles);
      });
    };

    ArticleProvider.prototype.findArticleByTitlePage = function(title, start, amount, callback) {
      return this.articleDao.findAll({
        where: "title like '%" + title + "%'",
        order: 'id DESC',
        limit: amount,
        offset: start
      }).on('success', function(articles) {
        var a, _i, _len;
        for (_i = 0, _len = articles.length; _i < _len; _i++) {
          a = articles[_i];
          if (a.body.length > 300) a.body = a.body.substring(0, 297) + '...';
        }
        return callback(null, articles);
      });
    };

    ArticleProvider.prototype.countAllByTitle = function(title, callback) {
      return this.articleDao.count({
        where: "title like '%" + title + "%'"
      }).on('success', function(c) {
        return callback(null, c);
      }).on('error', function(error) {
        return callback(error, null);
      });
    };

    ArticleProvider.prototype.countAll = function(callback) {
      return this.articleDao.count().on('success', function(c) {
        return callback(null, c);
      }).on('error', function(error) {
        return callback(error, null);
      });
    };

    ArticleProvider.prototype.updateArticle = function(id, title, body, callback) {
      return this.articleDao.find({
        where: {
          id: id
        }
      }).on('success', function(a) {
        if (a) {
          a.title = title;
          a.body = body;
          return a.save().on('success', function(aa) {
            return callback(null, aa);
          });
        }
      }).on('error', function(error) {
        return callback(error, null);
      });
    };

    ArticleProvider.prototype.addArticle = function(title, body, u_id, callback) {
      return this.articleDao.build({
        title: title,
        body: body,
        USERId: u_id
      }).save().on('success', function(article) {
        if (article) {
          return callback(null, article);
        } else {
          return callback('Save Blog Failed', null);
        }
      }).on('error', function(error) {
        return callback('internal error', error);
      });
    };

    return ArticleProvider;

  })();

  module.exports = ArticleProvider;

}).call(this);
