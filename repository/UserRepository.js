const USER = require('../models/db_models').USER;

exports.RegisterUser = async function (name, password) {
    if (name && password && !await this.IsUserExist(name))
        USER.create({NAME: name, PASS: password})
            .catch((err) => console.log('Error: ' + err.message));
};

exports.GetAllUsers = async function () {
    return await USER.findAll().then(res => {
        let result = [];
        for (let item of res) {
            result.push({NAME: item.dataValues.NAME, PASS: item.dataValues.PASS})
        }
        return result;
    })
};

exports.GetUser = async function (name) {
    return await USER.findAll({
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

exports.UpdateUser = async function (name, password) {
    USER.update(
        {PASS: password},
        {where: {NAME: name}}
    ).catch((err) => console.log('Error: ' + err.message));
}

exports.RemoveUser = async function (name) {
    USER.destroy({where: {NAME: name}})
        .catch((err) => console.log('Error: ' + err.message));
}

exports.VerifyPassword = async function (name, password) {
    let user = await this.GetUser(name);
    if (password && name && user.PASS)
        return user.PASS === password;
}

exports.IsUserExist = async function (name) {
    let user = await this.GetUser(name);
    return !!user;
}
