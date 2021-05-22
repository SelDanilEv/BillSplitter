const roomRepository = require("../repository/RoomRepository");
const fs = require('fs');
const consts = require("../helpers/Consts");

exports.ConnectToRoom = async function (request, response) {
    if(!request.body.ROOM_NAME || !request.body.ROOM_PASS){
        response.send(consts.BadRequest);
        return;
    }

    if (!await roomRepository.IsRoomExist(request.body.ROOM_NAME)) {
        await roomRepository.CreateRoom(request.body.ROOM_NAME, request.body.ROOM_PASS);
    }
    if (await roomRepository.VerifyPassword(request.body.ROOM_NAME, request.body.ROOM_PASS)) {
        if (!await roomRepository.IsUserBelongToRoom(request.body.ROOM_NAME, request.body.USER_NAME)) {
            await roomRepository.AddUserToRoom(request.body.ROOM_NAME, request.currentUser.NAME);
        }

        let view = fs.readFileSync('./view/views/HomePage.html',"utf8");
        response.send(view);
        return
    }

    response.send(consts.WrongPassword);
};

exports.UpdateRoom = async function (request, response) {
    await roomRepository.UpdateRoom(request.body.NAME, request.body.PASS);
    response.send();
};

exports.RemoveRoom = async function (request, response) {
    await roomRepository.RemoveRoom(request.body.NAME);
    response.send();
};

exports.GetAllRooms = async function (request, response) {
    let res = await roomRepository.GetAllRooms();
    response.send(JSON.stringify(res));
};

exports.GetAllUsersByRoom = async function (request, response) {
    let res = await roomRepository.GetAllUsersByRoom(request.body.ROOM_NAME);
    response.send(JSON.stringify(res));
};

exports.AddUserToRoom = async function (request, response) {
    await roomRepository.AddUserToRoom(request.body.ROOM_NAME, request.body.USER_NAME);
    response.send();
};

exports.RemoveUserFromRoom = async function (request, response) {
    await roomRepository.RemoveUserFromRoom(request.body.ROOM_NAME, request.body.USER_NAME);
    response.send();
};

exports.GetRoom = async function (request, response) {
    let res = await roomRepository.GetRoom(request.params.NAME);
    response.send(JSON.stringify(res));
};

exports.IsRoomExist = async function (request, response) {
    let res = await roomRepository.IsRoomExist(request.body.NAME);
    response.send(JSON.stringify({status: res}));
};

exports.VerifyPassword = async function (request, response) {
    let res = false;
    if (await roomRepository.IsRoomExist(request.body.NAME)) {
        res = await roomRepository.VerifyPassword(request.body.NAME, request.body.PASS);
    }
    response.send(JSON.stringify({status: res}));
};
