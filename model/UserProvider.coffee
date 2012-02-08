BaseProvider = require './BaseProvider'

class UserProvider extends BaseProvider
  constructor: (seq)->
    console.log seq
    @userDao = seq.import __dirname + '/template/user_seq_template'

  findUserById: (u_id, callback)->
    @userDao.find(u_id).on 'success', (u)->
      callback null, u

  findUserByName: (u_name, callback)->
    @userDao.find({where: {name: u_name}}).on 'success', (u)->
      callback null, u

  findUserByEmail: (u_email, callback)->
    @userDao.find({where: {name: u_email}}).on 'success', (u)->
      callback null, u

  addUser: (u, callback)->
    @userDao.build({name: u.name, email: u.email, status: u.status, password:u.password}).save().on 'success', ()->
      callback null, null

module.exports = UserProvider
