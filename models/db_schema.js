const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ROOM extends Model {
};

class USER extends Model {
};

class REQUEST extends Model {
};

class USER_ROOM extends Model {
};

function internalORM(sequelize) {
    ROOM.init(
        {
            NAME: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            PASS: {type: Sequelize.STRING, allowNull: false}
        },
        {sequelize, modelName: 'ROOM', tableName: 'ROOM', timestamps: false}
    );
    USER.init(
        {
            NAME: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            PASS: {type: Sequelize.STRING, allowNull: false}
        },
        {sequelize, modelName: 'USER', tableName: 'USERS', timestamps: false}
    );
    USER_ROOM.init(
        {},
        {sequelize, modelName: 'USER_ROOM', tableName: 'USER_ROOM', timestamps: false}
    );
    REQUEST.init(
        {
            AMOUNT: {type: Sequelize.DECIMAL, allowNull: false},
            COMMENT: {type: Sequelize.STRING, allowNull: true},
            ACCEPTED: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0}
        },
        {sequelize, modelName: 'REQUEST', tableName: 'REQUEST', timestamps: false}
    );

    USER.belongsToMany(ROOM, {
        through: "USER_ROOM",
        as: "members",
        foreignKey: "user_id",
    });

    ROOM.belongsToMany(USER, {
        through: "USER_ROOM",
        as: "members",
        foreignKey: "room_id",
    });

    USER.belongsToMany(USER, {
        through: REQUEST,
        as: "USER_FROM",
        foreignKey: "USER_FROM",
    });

    USER.belongsToMany(USER, {
        through: REQUEST,
        as: "USER_TO",
        foreignKey: "USER_TO",
    });

    sequelize.sync(true).catch(e => {
        console.log(e)
    });

    // USER_ROOM.findAll()
    //     .then((users) => {
    //         console.log(users);
    //     })
    //
    // REQUEST.findAll({
    //     where: {
    //         USER_FROM: "Danil"
    //     }
    // })
    //     .then((users) => {
    //         console.log(users);
    //     })

}

exports.ORM = (s) => {
    internalORM(s);
    return {ROOM, USER_ROOM, USER, REQUEST};
}

