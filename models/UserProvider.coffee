crypto = require 'crypto'

class UserProvider
  constructor: (@seq)->
    @userDao = @seq.import __dirname + '/template/user_seq_template'

  secure_with_salt: (pwd, salt)->
    # secure user password with salt (by default, email)
    crypto.createHmac('sha256', salt).update(pwd).digest('hex')

  findUserById: (u_id, callback)->
    @userDao.find(u_id).on 'success', (u)->
      callback null, u

  findUserByName: (u_name, callback)->
    @userDao.find({where: {name: u_name}}).on 'success', (u)->
      callback null, u

  findUserByEmail: (u_email, callback)->
    @userDao.find({where: {email: u_email}}).on 'success', (u)->
      callback null, u

  addUser: (email, password, name, callback)->
    @userDao.build({name: name, email: email, password: @secure_with_salt(password, email)}).save()
      .on('success', (u)->
        if u
          callback null, u
        else
          callback 'Registeration failed', null
      ).on('error', (error)->
        callback 'internal error', null
      )

  authenticate: (email, password, callback)->
    @userDao.find({where: {email: email, password: @secure_with_salt(password, email)}}).on('success', (u)->
      # any good response, include 0 result set size will arrive here
      if u
        callback null, u
      else
        callback 'Authentication failed', null
    ).on('error', (error)->
      callback 'internal error', null
    )
module.exports = UserProvider
