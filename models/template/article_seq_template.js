(function() {

  module.exports = function(seq, DataTypes) {
    return seq.define('ARTICLE', {
      title: DataTypes.STRING,
      body: DataTypes.TEXT
    });
  };

}).call(this);
