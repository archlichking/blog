(function() {
  module.exports = function(seq, DataTypes) {
    return seq.define('article', {
      title: DataTypes.STRING,
      body: DataTypes.TEXT
    });
  };
}).call(this);
