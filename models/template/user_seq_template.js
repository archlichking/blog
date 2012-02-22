(function() {

  module.exports = function(seq, DataTypes) {
    return seq.define('user', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  };

}).call(this);
