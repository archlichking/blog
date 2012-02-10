seq = new (require('sequelize'))('blog', 'root', '', {host: 'localhost', port: '3306'})
# module
userProvider = new (require('models/UserProvider'))(seq)

exports.logout = (req, res)->
  req.session = {user: null}
  res.render 'index', {title: 'welcome', user: null}


exports.login = (req, res)->
  req.session = {user: null}
  userProvider.authenticate req.body.email, req.body.password, (error, u)->
    if error
      req.flash 'error', error
      res.render 'index', {title: 'welcome', user: null}
    else if u
      req.session = {user: u}
      res.render 'index', {title: 'welcome', user: req.session.user}

register_params_validate = (req, res, callback)->
  ret = false
  # param validation
  # -- null validation
  if req.body.email is '' or req.body.password is '' or req.body.re_password is '' or req.body.name is ''
    req.flash 'error', 'Null input exists'
    ret = true
  # -- email validation
  # -- password validation
  else if req.body.password isnt req.body.re_password
    req.flash 'error', 'Password doesnt match'
    ret = true
  callback ret

exports.register = (req, res)->
  req.session = {user: null}
  register_params_validate req, res, (ret)->
    if ret
      res.render 'index_reg', {title: 'welcome', user: null}
    else 
      userProvider.addUser req.body.email, req.body.password, req.body.name, (error, u)->
        if error
          req.flash 'error', error
          res.render 'index_reg', {title: 'welcome', user: null}
        else if u
          req.session = {user: u}
          res.render 'index', {title: 'welcome', user: req.session.user}

exports.register_redirect = (req, res)->
  # session keeping
  if req.session and req.session.user
    res.render 'index', {title: 'welcome', user: req.session.user}
  else
    req.session = {user: null}
    res.render 'index_reg', {title: 'welcome registeration'}
