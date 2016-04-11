var static = require('node-static');

var fileServer = new static.Server('./dist');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response);
  }).resume();
}).listen(process.env.npm_package_config_port);
