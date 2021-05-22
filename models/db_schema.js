const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ROOM extends Model {}

class USER extends Model {}

class REQUEST extends Model {}

class USER_ROOM extends Model {}

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
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            AMOUNT: {type: Sequelize.DOUBLE, allowNull: false},
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
        through: {model: REQUEST, unique: false},
        as: "USER_FROM",
        foreignKey: "USER_FROM",
    });

    USER.belongsToMany(USER, {
        through: {model: REQUEST, unique: false},
        as: "USER_TO",
        foreignKey: "USER_TO",
    });

    sequelize.sync(true).catch(e => {
        console.log(e);
    });
}

exports.ORM = (s) => {
    internalORM(s);
    return {ROOM, USER_ROOM, USER, REQUEST};
}
