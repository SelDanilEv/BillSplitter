const fs = require('fs');

exports.index = function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(fs.readFileSync('./views/index.html'));
    // response.send("Main content example");
};
exports.about = function (request, response) {
    response.send("About page example");
};

exports.login = async function (request, response) {
    let view = fs.readFileSync('./views/SignInAndRegister.html',"utf8");
    response.send(view);
};

exports.login = async function (request, response) {
    let view = fs.readFileSync('./views/SignInAndRegister.html',"utf8");
    response.send(view);
};
