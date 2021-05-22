const REQUEST = require('./../models/db_models').REQUEST;

exports.CreateRequest = async function (user_from, user_to, comment, amount) {
    REQUEST.create({
        USER_FROM: user_from,
        USER_TO: user_to,
        COMMENT: comment,
        AMOUNT: amount,
        ACCEPTED: false
    })
        .catch((err) => console.log('Error: ' + err.message));
};

exports.UpdateRequest = async function (user_from, user_to,comment,amount) {
    REQUEST.update(
        {AMOUNT: amount},
        {where: {USER_FROM: user_from, USER_TO: user_to, COMMENT:comment}}
    ).catch((err) => console.log('Error: ' + err.message));
}

exports.GetRequest = async function (user_from, user_to, amount, accepted) {
    return await REQUEST.findAll({
        where: {
            USER_FROM: user_from,
            USER_TO: user_to,
            AMOUNT: amount,
            ACCEPTED: accepted
        }
    }).then(res => {
        let result = [];
        for (let item of res) {
            result.push(
                {
                    USER_FROM: item.dataValues.USER_FROM,
                    USER_TO: item.dataValues.USER_TO,
                    AMOUNT: item.dataValues.AMOUNT,
                    COMMENT: item.dataValues.COMMENT,
                    ACCEPTED: item.dataValues.ACCEPTED
                })
        }
        if (result.length > 0)
            return result[0];
    })
};

exports.AcceptRequest = async function (user_from, user_to, comment, amount) {
    REQUEST.update(
        {
            ACCEPTED: true
        },
        {
            where: {
                USER_FROM: user_from,
                USER_TO: user_to,
                COMMENT: comment,
                AMOUNT: amount,
            }
        }
    ).catch((err) => console.log('Error: ' + err.message));
}

exports.RemoveRequest = async function (user_from, user_to, comment, amount) {
    REQUEST.destroy({
        where: {
            USER_FROM: user_from,
            USER_TO: user_to,
            COMMENT: comment,
            AMOUNT: amount,
        }
    })
        .catch((err) => console.log('Error: ' + err.message));
}

exports.GetAllUserRequestFrom = async function (user_from) {
    let requests = await REQUEST.findAll({
        where: {
            USER_FROM: user_from,
            ACCEPTED: false
        }
    }).then(res => {
        let result = [];
        for (let item of res) {
            result.push({
                USER_FROM: item.dataValues.USER_FROM,
                USER_TO: item.dataValues.USER_TO,
                AMOUNT: item.dataValues.AMOUNT,
                COMMENT: item.dataValues.COMMENT,
                ACCEPTED: item.dataValues.ACCEPTED
            })
        }
        return result;
    })
    return requests;
}

exports.GetAllUserRequestTo = async function (user_to) {
    let requests = await REQUEST.findAll({
        where: {
            USER_TO: user_to,
            ACCEPTED: false
        }
    }).then(res => {
        let result = [];
        for (let item of res) {
            result.push({
                USER_FROM: item.dataValues.USER_FROM,
                USER_TO: item.dataValues.USER_TO,
                AMOUNT: item.dataValues.AMOUNT,
                COMMENT: item.dataValues.COMMENT,
                ACCEPTED: item.dataValues.ACCEPTED
            })
        }
        return result;
    })
    return requests;
}

exports.GetAllUserDebts = async function (user_from) {
    let userDebts = await this.GetAllUserRequestFrom(user_from);
    let debtAmount = 0;
    for (let item of userDebts) {
        debtAmount += item.AMOUNT;
    }
    return debtAmount;
}

