"use strict";

const mysql = require("mysql");

const config = require("../config/database");

class MySQL_CORE {
  db;

  constructor() {
    this.db = mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    });
  }

  connect() {
    this.db.connect(err => {
      if (err) throw err;
      console.log(`Connected to ${config.database} MySQL database!`);
    });
  }
}

module.exports = MySQL_CORE;
