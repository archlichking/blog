UserProvider = require 'model/UserProvider'
userProvier = new UserProvider 

exports.index = (req, res)->
  userProvider.findUserById 1, (error, u)->
    res.render 'index', {title: 'welcome', user: u}
