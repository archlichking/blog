(function() {
  var ArticleProvider;

  ArticleProvider = (function() {

    function ArticleProvider(seq) {
      this.seq = seq;
      this.UserProvider = new (require('models/UserProvider'))(seq);
      this.articleDao = this.seq["import"](__dirname + '/template/article_seq_template');
    }

    ArticleProvider.prototype.findArticleById = function(a_id, callback) {
      console.log(a_id);
      return this.articleDao.find({
        where: {
          id: a_id
        }
      }).on('success', function(a) {
        return callback(null, a);
      });
    };

    ArticleProvider.prototype.findArticlesByUserId = function(u_id, callback) {
      var userProvider;
      userProvider = this.UserProvider;
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
          userProvider.findUserById(a.USERId, function(error, u) {
            return a.username = u.name;
          });
        }
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
