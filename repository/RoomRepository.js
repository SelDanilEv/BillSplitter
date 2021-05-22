const Room = require('./../models/db_models').ROOM;
const UserRoom = require('./../models/db_models').USER_ROOM;
const bcrypt = require('./../security/bcrypt')

exports.CreateRoom = async function (name, password) {
    if (name && password && !await this.IsRoomExist(name)) {
        password = await bcrypt.cryptPassword(password);
        await Room.create({NAME: name, PASS: password})
            .catch((err) => console.log('Error: ' + err.message));
    }
};

exports.AddUserToRoom = async function (room_name, user_name) {
    if (!await this.IsUserBelongToRoom(room_name, user_name)) {
        await UserRoom.create({room_id: room_name, user_id: user_name})
            .catch((err) => console.log('Error: ' + err.message));
    }
};

exports.RemoveUserFromRoom = async function (room_name, user_name) {
    if (await this.IsUserBelongToRoom(room_name, user_name)) {
        UserRoom.destroy({where: {room_id: room_name, user_id: user_name}})
            .catch((err) => console.log('Error: ' + err.message));
    }
};

exports.GetAllRooms = async function () {
    return await Room.findAll().then(res => {
        let result = [];
        for (let item of res) {
            result.push({NAME: item.dataValues.NAME, PASS: item.dataValues.PASS})
        }
        return result;
    })
};

exports.GetRoom = async function (name) {
    return await Room.findAll({
        where: {
            NAME: name
        }
    }).then(res => {
        let result = [];
        for (let item of res) {
            result.push({NAME: item.dataValues.NAME, PASS: item.dataValues.PASS})
        }
        if (result.length > 0)
            return result[0];
    })
};

exports.UpdateRoom = async function (name, password) {
    Room.update(
        {PASS: password},
        {where: {NAME: name}}
    ).catch((err) => console.log('Error: ' + err.message));
}

exports.IsUserBelongToRoom = async function (room_name, user_name) {
    return !!(await this.GetAllUsersByRoom(room_name)).find(x => x === user_name);
}

exports.RemoveRoom = async function (name) {
    Room.destroy({where: {NAME: name}})
        .catch((err) => console.log('Error: ' + err.message));
}

exports.IsRoomExist = async function (name) {
    let room = await this.GetRoom(name);
    return !!room;
}

exports.VerifyPassword = async function (name, password) {
    let room = await this.GetRoom(name);
    if (room) {
        if (password && name && room.PASS) {
            return bcrypt.comparePassword(password, room.PASS);
        }
    }
    return false;
}

exports.GetAllUsersByRoom = async function (name) {
    let rooms = await UserRoom.findAll({
        where: {
            room_id: name
        }
    }).then(res => {
        let result = [];
        for (let item of res) {
            result.push(item.dataValues.user_id)
        }
        return result;
    })
    return rooms;
}
