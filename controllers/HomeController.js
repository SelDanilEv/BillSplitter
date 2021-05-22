const fs = require('fs');
const consts = require("../helpers/Consts");

exports.index = function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(fs.readFileSync('./view/index.html'));
    // response.send("Main content example");
};
exports.about = function (request, response) {
    response.send("About page example");
};

exports.login = async function (request, response) {
    let view;
    if (request.user) {
        view = fs.readFileSync('./view/views/ConnectRoom.html', "utf8");
    } else {
        view = fs.readFileSync('./view/views/SignInAndRegister.html', "utf8");
    }
    response.send(view);
};

exports.newBill = async function (request, response) {
    let view = fs.readFileSync('./view/views/CreateNewBill.html', "utf8");
    response.send(view);
};

exports.logout = async function (request, response) {
    request.session.logout = true;
    request.logout();
    delete request.user;
    response.redirect('/')
};
