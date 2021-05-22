const userRepository = require("../repository/UserRepository");
const fs = require('fs');
const consts = require("../helpers/Consts");

exports.RegisterUser = async function (request, response) {
    await userRepository.RegisterUser(request.body.NAME, request.body.PASS);
    response.send();
};

exports.GetCurrentUser = async function (request, response) {
    response.send(JSON.stringify(request.user.NAME || null));
};

exports.ConnectUser = async function (request, response) {
    if (!await userRepository.IsUserExist(request.body.NAME)) {
        await userRepository.RegisterUser(request.body.NAME, request.body.PASS);
    }
    let res = await userRepository.VerifyPassword(request.body.NAME, request.body.PASS);
    if (res) {
        let view = fs.readFileSync('./view/views/ConnectRoom.html', "utf8");
        response.redirect(view);
    } else {
        response.redirect("/");
    }

};

exports.UpdateUser = async function (request, response) {
    await userRepository.UpdateUser(request.body.NAME, request.body.PASS);
    response.send();
};

exports.RemoveUser = async function (request, response) {
    await userRepository.RemoveUser(request.body.NAME);
    response.send();
};

exports.GetAllUsers = async function (request, response) {
    let res = await userRepository.GetAllUsers();
    response.send(JSON.stringify(res));
};

exports.GetUser = async function (request, response) {
    let res = await userRepository.GetUser(request.params.NAME);
    response.send(JSON.stringify(res));
};

exports.IsUserExist = async function (request, response) {
    let res = await userRepository.IsUserExist(request.body.NAME);
    response.send(JSON.stringify({status: res}));
};

exports.VerifyPassword = async function (request, response) {
    let res = false;
    if (await userRepository.IsUserExist(request.body.NAME)) {
        res = await userRepository.VerifyPassword(request.body.NAME, request.body.PASS);
    }
    response.send(JSON.stringify({status: res}));
};
