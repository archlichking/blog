(function() {
  module.exports = function(seq, DataTypes) {
    return seq.define('category', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  };
}).call(this);
