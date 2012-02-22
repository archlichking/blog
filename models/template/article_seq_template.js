(function() {

  module.exports = function(seq, DataTypes) {
    return seq.define('article', {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      readTimes: DataTypes.INTEGER,
      commentTimes: DataTypes.INTEGER
    });
  };

}).call(this);
