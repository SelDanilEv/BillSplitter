const sequelize = require("../db_connection.js");
const models = {ROOM, USER_ROOM, USER, REQUEST} = require('..\\models\\db_schema').ORM(sequelize);
module.exports = models;
