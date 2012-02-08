(function() {
  var UserProvider, userProvier;
  UserProvider = require('model/UserProvider');
  userProvier = new UserProvider;
  exports.index = function(req, res) {
    return userProvider.findUserById(1, function(error, u) {
      return res.render('index', {
        title: 'welcome',
        user: u
      });
    });
  };
}).call(this);
