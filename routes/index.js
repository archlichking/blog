(function() {
  var seq, userProvider;
  seq = new (require('sequelize'))('blog', 'root', '', {
    host: 'localhost',
    port: '3306'
  });
  userProvider = new (require('model/UserProvider'))(seq);
  exports.index = function(req, res) {
    if (req.session && req.session.user) {
      req.flash('info', '');
      return res.render('index', {
        title: 'welcome',
        user: req.session.user
      });
    } else {
      req.session = {
        user: null
      };
      req.flash('info', '');
      return res.render('index', {
        title: 'welcome',
        user: null
      });
    }
  };
}).call(this);
