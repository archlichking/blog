(function() {
  var Comment, User;

  User = require('./User');

  Comment = (function() {

    function Comment() {
      this.dummy_data = [
        {
          id: 1,
          owner_id: 1,
          article_id: 1,
          body: 'try this one in thread',
          createdAt: '2012-02-08 13:22:30',
          updatedAt: '2012-02-08 13:22:30'
        }, {
          id: 2,
          owner_id: 2,
          article_id: 1,
          body: 'suck it up',
          createdAt: '2012-02-08 13:22:30',
          updatedAt: '2012-02-08 13:22:30'
        }
      ];
      this.user = new User();
    }

    Comment.prototype.findCommentsByArticleId = function(a_id, callback) {
      var d, ret, _i, _len, _ref;
      console.log("invoking findCommentsByArticleId with a_id=" + a_id);
      ret = [];
      _ref = this.dummy_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.article_id === parseInt(a_id)) {
          this.user.findUserById(d.owner_id, function(error, u) {
            return d['owner_name'] = u.name;
          });
          ret.push(d);
        }
      }
      return callback(null, ret);
    };

    Comment.prototype.findCommentsByOwnerId = function(o_id, callback) {
      return console.log("invoking findCommentsByOwnerId with o_id=" + o_id);
    };

    return Comment;

  })();

  module.exports = Comment;

}).call(this);
