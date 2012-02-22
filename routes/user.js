(function() {
  var register_params_validate;
  register_params_validate = function(req, res, callback) {
    var ret;
    ret = false;
    if (req.body.email === '' || req.body.password === '' || req.body.re_password === '' || req.body.name === '') {
      req.flash('error', 'Null input exists');
      ret = true;
    } else if (req.body.password !== req.body.re_password) {
      req.flash('error', 'Password doesnt match');
      ret = true;
    }
    return callback(ret);
  };
  app.namespace('/user', function() {
    app.get('/', function(req, res) {
      return res.render('user', {
        title: 'welcome',
        user: req.session.user
      });
    });
    app.post('/login', function(req, res) {
      req.session = {
        user: null
      };
      return userProvider.authenticate(req.body.email, req.body.password, function(error, u) {
        if (error) {
          req.flash('error', error);
          return res.render('index', {
            title: 'welcome',
            user: null
          });
        } else if (u) {
          req.session = {
            user: u
          };
          return res.render('user', {
            title: 'welcome',
            user: req.session.user
          });
        }
      });
    });
    app.get('/logout', function(req, res) {
      req.session = {
        user: null
      };
      return res.redirect('/');
    });
    app.post('/register', function(req, res) {
      req.session = {
        user: null
      };
      return register_params_validate(req, res, function(ret) {
        if (ret) {
          return res.render('index_reg', {
            title: 'welcome',
            user: null
          });
        } else {
          return userProvider.findUserByEmail(req.body.email, function(error, u) {
            if (u) {
              req.flash('error', 'Email Aready Taken');
              return res.render('index_reg', {
                title: 'welcome',
                user: null
              });
            } else {
              return userProvider.addUser(req.body.email, req.body.password, req.body.name, function(error, u) {
                if (error) {
                  req.flash('error', error);
                  return res.render('index_reg', {
                    title: 'welcome',
                    user: null
                  });
                } else if (u) {
                  req.session = {
                    user: u
                  };
                  return res.render('user', {
                    title: 'welcome',
                    user: req.session.user
                  });
                }
              });
            }
          });
        }
      });
    });
    return app.get('register_redirect', function(req, res) {
      if (req.session && req.session.user) {
        return res.render('user', {
          title: 'welcome',
          user: req.session.user
        });
      } else {
        req.session = {
          user: null
        };
        return res.render('index_reg', {
          title: 'welcome registeration'
        });
      }
    });
  });
}).call(this);
