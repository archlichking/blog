(function() {
  var Article, Comment, User;

  Comment = require('./Comment');

  User = require('./USer');

  Article = (function() {

    function Article() {
      this.dummy_data = [
        {
          id: 1,
          title: 'welcome',
          body: 'welcome everyone, here is first article',
          owner_id: 1,
          createdAt: '2012-02-07 21:12:32',
          updatedAt: '2012-02-07 21:12:32'
        }, {
          id: 2,
          title: 'serious article',
          body: 'no shit',
          owner_id: 1,
          createdAt: '2012-02-09 21:12:32',
          updatedAt: '2012-02-09 21:12:32'
        }
      ];
      this.comment = new Comment();
      this.user = new User();
    }

    Article.prototype.findArticleById = function(id, callback) {
      var d, _i, _len, _ref, _results;
      console.log("invoking findArticleById with id=" + id);
      _ref = this.dummy_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.id === parseInt(id)) {
          this.comment.findCommentsByArticleId(d.id, function(error, comments) {
            return d['comments'] = comments;
          });
          console.log(d);
          _results.push(callback(null, d));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Article.prototype.findArticleByTitle = function(t, callback) {
      var d, _i, _len, _ref, _results;
      console.log("invoking findArticleByTitle with title like " + t);
      _ref = this.dummy_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.title === t) {
          _results.push(callback(null, d));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Article.prototype.findArticleByOwnerId = function(o_id, callback) {
      var d, ret, _i, _len, _ref;
      ret = [];
      console.log("invoking findArticleByOwnerId with owner_id=" + o_id);
      _ref = this.dummy_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.owner_id === o_id) ret.push(d);
      }
      return callback(null, ret);
    };

    Article.prototype.findAll = function(callback) {
      var d, ret, _i, _len, _ref;
      console.log("invoking findAll articles");
      ret = [];
      _ref = this.dummy_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        this.findArticleById(d.id, function(error, a) {
          return ret.push(a);
        });
      }
      return callback(null, ret);
    };

    return Article;

  })();

  module.exports = Article;

}).call(this);
