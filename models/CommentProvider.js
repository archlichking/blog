(function() {
  var CommentProvider;
  CommentProvider = (function() {
    function CommentProvider(seq) {
      this.seq = seq;
      this.commentDao = this.seq["import"](__dirname + '/template/comment_seq_template');
    }
    CommentProvider.prototype.findCommentsByArticleId = function(start, amount, a_id, callback) {
      return this.commentDao.findAll({
        where: {
          ARTICLEId: a_id
        },
        order: 'id DESC',
        limit: amount,
        offset: start
      }).on('success', function(comments) {
        return callback(null, comments);
      });
    };
    CommentProvider.prototype.countAllByArticleId = function(a_id, callback) {
      return this.commentDao.count({
        where: {
          ARTICLEId: a_id
        }
      }).on('success', function(c) {
        return callback(null, c);
      });
    };
    CommentProvider.prototype.addComment = function(body, a_id, callback) {
      return this.commentDao.build({
        body: body,
        ARTICLEId: a_id
      }).save().on('success', function(comment) {
        if (comment) {
          return callback(null, comment);
        } else {
          return callback('Save Comment Failed', null);
        }
      }).on('error', function(error) {
        return callback('internal error', error);
      });
    };
    return CommentProvider;
  })();
  module.exports = CommentProvider;
}).call(this);
