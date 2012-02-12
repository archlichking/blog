(function() {
  var UserProvider, crypto;

  crypto = require('crypto');

  UserProvider = (function() {

    function UserProvider(seq) {
      this.seq = seq;
      this.userDao = this.seq["import"](__dirname + '/template/user_seq_template');
    }

    UserProvider.prototype.secure_with_salt = function(pwd, salt) {
      return crypto.createHmac('sha256', salt).update(pwd).digest('hex');
    };

    UserProvider.prototype.findUserById = function(u_id, callback) {
      return this.userDao.find(u_id).on('success', function(u) {
        return callback(null, u);
      });
    };

    UserProvider.prototype.findUserByName = function(u_name, callback) {
      return this.userDao.find({
        where: {
          name: u_name
        }
      }).on('success', function(u) {
        return callback(null, u);
      });
    };

    UserProvider.prototype.findUserByEmail = function(u_email, callback) {
      return this.userDao.find({
        where: {
          email: u_email
        }
      }).on('success', function(u) {
        return callback(null, u);
      });
    };

    UserProvider.prototype.addUser = function(email, password, name, callback) {
      return this.userDao.build({
        name: name,
        email: email,
        password: this.secure_with_salt(password, email)
      }).save().on('success', function(u) {
        if (u) {
          return callback(null, u);
        } else {
          return callback('Registeration failed', null);
        }
      }).on('error', function(error) {
        return callback('internal error', null);
      });
    };

    UserProvider.prototype.authenticate = function(email, password, callback) {
      return this.userDao.find({
        where: {
          email: email,
          password: this.secure_with_salt(password, email)
        }
      }).on('success', function(u) {
        if (u) {
          return callback(null, u);
        } else {
          return callback('Authentication failed', null);
        }
      }).on('error', function(error) {
        return callback('internal error', null);
      });
    };

    return UserProvider;

  })();

  module.exports = UserProvider;

}).call(this);
