var http = require('http'),
    port = 6789,
    fs = require('fs'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

var framework = require('./framework');

framework
    .Routes
    .addDefaultRoute('./controllers/404')
    .addRoute('/', './controllers/home')
    .addRoute('/home', './controllers/home')
    .ignoreRoute('.(css)');

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        var exitCode = worker.process.exitCode;
        console.log('Server running on PID #' + worker.process.pid + ' at http://127.0.0.1:6789/ died (' + exitCode + '). Restarting process...');
        cluster.fork();
    });
} else {
    console.log('Server running on PID #' + cluster.worker.process.pid + ' at http://127.0.0.1:6789/');
    http.createServer(function(request, response) {
        framework.Routes.getRoute(request, response);
    }).listen(port);
}