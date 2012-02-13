(function() {
  var ArticleProvider;
  ArticleProvider = (function() {
    function ArticleProvider(seq) {
      this.seq = seq;
      this.articleDao = this.seq["import"](__dirname + '/template/article_seq_template');
    }
    ArticleProvider.prototype.findArticleById = function(a_id, callback) {
      return this.articleDao.find(a_id).on('success', function(a) {
        return callback(null, a);
      });
    };
    ArticleProvider.prototype.findArticlesByUserId = function(u_id, callback) {
      return this.articleDao.find({
        where: {
          userid: u_id
        }
      }).on('success', function(as) {
        return callback(null, as);
      });
    };
    return ArticleProvider;
  })();
  module.exports = ArticleProvider;
}).call(this);
