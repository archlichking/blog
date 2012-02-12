(function() {

  app.get('/', function(req, res) {
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
  });

}).call(this);
