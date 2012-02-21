(function() {

  module.exports = function(seq, DataTypes) {
    return seq.define('COMMENT', {
      body: DataTypes.STRING
    });
  };

}).call(this);
