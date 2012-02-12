app.get '/', (req, res)->
  # init req.session.user to null anyway
  if req.session and req.session.user
    req.flash 'info', ''
    res.render 'index', {title: 'welcome', user: req.session.user}
  else
    req.session = {user: null}
    req.flash 'info', ''
    res.render 'index', {title: 'welcome', user: null}
