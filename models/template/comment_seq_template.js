(function() {

  module.exports = function(seq, DataTypes) {
    return seq.define('comment', {
      body: DataTypes.STRING,
      email: DataTypes.STRING
    });
  };

}).call(this);
