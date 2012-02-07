(function() {
  var Article;

  Article = (function() {

    function Article() {
      this.dummy_data = [
        {
          title: 'welcome',
          body: 'welcome everyone, here is first article',
          owner_id: 1,
          createdAt: '2012-02-07 21:12:32',
          updatedAt: '2012-02-07 21:12:32'
        }
      ];
    }

    Article.prototype.findArticleById = function(id) {
      console.log("invoking findArticleById with id=" + id);
      return this.dummy_data[id];
    };

    Article.prototype.findArticleByTitle = function(t) {
      var d, _i, _len, _ref;
      console.log("invoking findArticleByTitle with title like " + t);
      _ref = this.dummy_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.title === t) return d;
      }
    };

    Article.prototype.findArticleByOwnerId = function(o_id) {
      var d, ret, _i, _len, _ref;
      ret = [];
      console.log("invoking findArticleByOwnerId with owner_id=" + o_id);
      _ref = this.dummy_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        if (d.owner_id === o_id) ret.push(d);
      }
      return ret;
    };

    return Article;

  })();

  module.exports = Article;

}).call(this);
