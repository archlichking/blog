vm = require 'vm'
fs = require 'fs'

module.exports = (app, context)->
  dir = __dirname + '/routes'
  fs.readdirSync(dir).forEach (file)->
    unless file.match('.coffee')
      code = fs.readFileSync dir + '/' + file, 'utf8'
      context['app'] = app
      for key in global
        context[key] = global[key]

      vm.runInNewContext code, context, file
