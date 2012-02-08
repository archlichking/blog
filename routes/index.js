(function() {
  var User, user;
  User = require('model/dummy/User');
  user = new User();
  exports.index = function(req, res) {
    return user.findUserById(1, function(error, u) {
      return res.render('index', {
        title: 'welcome',
        user: u
      });
    });
  };
}).call(this);
