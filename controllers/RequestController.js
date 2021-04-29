const requestRepository = require("../repository/RequestRepository");

exports.CreateRequest = async function (request, response) {
    let requests = request.body;

    for (let item of requests) {
        await requestRepository.CreateRequest(
            item.USER_FROM,
            item.USER_TO,
            item.COMMENT,
            item.AMOUNT
        )
    }
    response.send();
};

exports.AcceptRequest = async function (request, response) {
    await requestRepository.AcceptRequest(
        request.body.USER_FROM,
        request.body.USER_TO,
        request.body.COMMENT,
        request.body.AMOUNT
    );
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
    let res = await requestRepository.GetAllUserRequestFrom(request.body.USER_FROM);
    response.send(JSON.stringify(res));
};

exports.GetAllUserRequestTo = async function (request, response) {
    let res = await requestRepository.GetAllUserRequestTo(request.body.USER_TO);
    response.send(JSON.stringify(res));
};

exports.GetAllUserDebts = async function (request, response) {
    let res = await requestRepository.GetAllUserDebts(request.body.USER_FROM);
    response.send(JSON.stringify(res));
};
