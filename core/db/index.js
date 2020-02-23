const config = require("../config/database");

const DB = require(`../${config.db.driver}`);

class Database extends DB {
  constructor(table) {
    super(table);
  }
}

module.exports = Database;
