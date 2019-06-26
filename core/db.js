const config = require('../config/database');

const Database = require(`../../database/helpers/${config.db.driver}`);

const db = new Database();

db.connect();

module.exports = db;