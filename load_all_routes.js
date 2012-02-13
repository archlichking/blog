(function() {
  var fs, vm;
  vm = require('vm');
  fs = require('fs');
  module.exports = function(app, context) {
    var dir;
    dir = __dirname + '/routes';
    return fs.readdirSync(dir).forEach(function(file) {
      var code, key, _i, _len;
      if (!file.match('.coffee')) {
        code = fs.readFileSync(dir + '/' + file, 'utf8');
        context['app'] = app;
        for (_i = 0, _len = global.length; _i < _len; _i++) {
          key = global[_i];
          context[key] = global[key];
        }
        return vm.runInNewContext(code, context, file);
      }
    });
  };
}).call(this);
