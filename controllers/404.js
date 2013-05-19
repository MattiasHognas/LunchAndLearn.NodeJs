var framework = require('../framework');

exports.get = function (req, res) {
    var model = require('../models/page');
    model.title = 'Lunch & Learn';
    model.content = 'Not found!';
    framework.Builder.build('./views/template-main.html', model, function (html) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    });
};