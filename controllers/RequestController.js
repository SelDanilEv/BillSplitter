const requestRepository = require("../repository/RequestRepository");
const consts = require("../helpers/Consts");

exports.CreateRequest = async function (request, response) {
    let requests = request.body;

    for (let item of requests) {
        let user_to = item.USER_TO || request.user.NAME;
        if (item.USER_FROM === user_to) continue;
        await requestRepository.CreateRequest(
            item.USER_FROM,
            user_to,
            item.COMMENT,
            item.AMOUNT
        )
    }
    response.send();
};

exports.AcceptRequest = async function (request, response) {
    if (request.body.USER_TO == request.currentUser.NAME) {
        await requestRepository.AcceptRequest(
            request.body.USER_FROM,
            request.body.USER_TO,
            request.body.COMMENT,
            request.body.AMOUNT
        );
        response.send(JSON.stringify(consts.OK));
    } else {
        response.send(JSON.stringify(consts.AppError));
    }
};

exports.UpdateRequest = async function (request, response) {
    await requestRepository.UpdateRequest(request.body.USER_FROM, request.body.USER_TO, request.body.COMMENT, request.body.AMOUNT);
    response.send();
};

exports.RemoveRequest = async function (request, response) {
    await requestRepository.RemoveRequest(
        request.body.USER_FROM,
        request.body.USER_TO,
        request.body.COMMENT,
        request.body.AMOUNT,
    );
    response.send();
};

exports.GetAllUserRequestFrom = async function (request, response) {
    let user = request.body.USER_FROM || request.currentUser.NAME;
    let res = await requestRepository.GetAllUserRequestFrom(user);
    response.send(JSON.stringify(res));
};

exports.GetAllUserRequestTo = async function (request, response) {
    let user = request.body.USER_TO || request.currentUser.NAME;
    let res = await requestRepository.GetAllUserRequestTo(user);
    response.send(JSON.stringify(res));
};

exports.GetAllUserDebts = async function (request, response) {
    let user = request.body.USER_FROM || request.currentUser.NAME;
    let res = await requestRepository.GetAllUserDebts(user);
    response.send(JSON.stringify(res));
};
