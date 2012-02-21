(function() {
  var User;
  User = (function() {
    function User() {
      this.dummy_data = [
        {
          id: 1,
          name: 'lay zhu',
          email: 'thunderzhulei@gmail.com',
          password: 'asdf',
          status: 'nothing to say'
        }, {
          id: 2,
          name: 'test user',
          email: 'testuser@blog.com',
          password: 'asdf',
          status: 'nothing to say again'
        }
      ];
    }
    User.prototype.findUserById = function(u_id, callback) {
      var d, _i, _len, _ref, _results;
      console.log("invoking getUserById with id=" + u_id);
      _ref = this.dummy_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        _results.push(d.id === parseInt(u_id) ? callback(null, d) : void 0);
      }
      return _results;
    };
    return User;
  })();
  module.exports = User;
}).call(this);
