(function() {
  var CommentProvider;
  CommentProvider = (function() {
    function CommentProvider(seq) {
      this.seq = seq;
      this.commentDao = this.seq["import"](__dirname + '/template/comment_seq_template');
    }
    CommentProvider.prototype.findCommentsByArticleId = function(a_id, callback) {
      return this.commentDao.findAll({
        where: {
          ARTICLEId: a_id
        },
        order: 'createdAt DESC',
        limit: 10
      }).on('success', function(comments) {
        return callback(null, comments);
      });
    };
    return CommentProvider;
  })();
  module.exports = CommentProvider;
}).call(this);
