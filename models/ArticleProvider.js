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
