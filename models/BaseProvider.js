(function() {
  var BaseProvider;

  BaseProvider = (function() {

    function BaseProvider(sequelize) {
      this.sequelize = sequelize;
    }

    return BaseProvider;

  })();

  module.exports = BaseProvider;

}).call(this);
