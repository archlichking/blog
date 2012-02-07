(function() {
  var User;

  User = (function() {

    function User() {
      this.dummy_users = {
        1: {
          real_name: 'lay zhu',
          email: 'thunderzhulei@gmail.com',
          password: 'asdf'
        },
        2: {
          real_name: 'test user',
          email: 'testuser@blog.com',
          password: 'asdf'
        }
      };
    }

    User.prototype.findUserById = function(id) {
      console.log('invoking getUserById with id=#{id}');
      return this.dummy_users[id];
    };

    return User;

  })();

  module.exports = User;

}).call(this);
