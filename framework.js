var Routes = function() {
    this.routes = [];
    this.ignoredRoutes = [];
    this.defaultRoute = '';
    this.getRoute = function (req, res) {
        var _this = this;
        var url = require('url');
        var fs = require('fs');
        req.requrl = url.parse(req.url, true);
        var path = req.requrl.pathname;
        var found = false;
        for (var i = 0; i < this.ignoredRoutes.length; i++) {
            if (new RegExp(this.ignoredRoutes[i]).test(path)) {
                found = true;
                res.writeHead(200, { 'Content-Type': 'text/css' });
                fs.readFile(__dirname + path, 'utf8', function(err, data) {
                    if (!err) {
                        found = true;
                        res.write(data, 'utf8');
                        res.end();
                    } else {
                        require(_this.defaultRoute).get(req, res);
                    }
                });
                break;
            }
        }
        if (!found) {
            for (var j = 0; j < this.routes.length; j++) {
                if (this.routes[j].path == path) {
                    found = true;
                    require(this.routes[j].controller).get(req, res);
                    break;
                }
            }
            if (!found)
                require(this.defaultRoute).get(req, res);
        }
        return this;
    };
    this.addRoute = function(path, controller) {
        this.routes.push({ path: path, controller: controller });
        return this;
    };
    this.addDefaultRoute = function(controller) {
        this.defaultRoute = controller;
        return this;
    };
    this.ignoreRoute = function (path) {
        this.ignoredRoutes.push(path);
        return this;
    };
};
var Builder = function () {
    this.build = function (view, model, result) {
        var fs = require('fs');
        fs.readFile(view, 'utf8', function (err, data) {
            if (err)
                return result(err);
            for (var prop in model)
                data = data.replace('{' + prop + '}', model[prop]);
            return result(data);
        });
    };
};
exports.Routes = new Routes();
exports.Builder = new Builder();