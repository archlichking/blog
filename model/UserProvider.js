(function() {
  var BaseProvider, UserProvider;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseProvider = require('./BaseProvider');
  UserProvider = (function() {
    __extends(UserProvider, BaseProvider);
    function UserProvider(seq) {
      console.log(seq);
      this.userDao = seq["import"](__dirname + '/template/user_seq_template');
    }
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
          name: u_email
        }
      }).on('success', function(u) {
        return callback(null, u);
      });
    };
    UserProvider.prototype.addUser = function(u, callback) {
      return this.userDao.build({
        name: u.name,
        email: u.email,
        status: u.status,
        password: u.password
      }).save().on('success', function() {
        return callback(null, null);
      });
    };
    return UserProvider;
  })();
  module.exports = UserProvider;
}).call(this);
