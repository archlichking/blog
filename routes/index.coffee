User = require 'model/dummy/User'
user = new User()

exports.index = (req, res)->
  user.findUserById 1, (error, u)->
    res.render 'index', {title: 'welcome', user: u}
