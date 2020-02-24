"use strict";

const Database = require("../db");

class Model extends Database {
  attr = {};

  constructor(table) {
    super(table);
  }

  async get(query = {}) {
    return await this.read(query);
  }

  async add() {
    return await this.create(this.attr);
  }

  async update(query = {}) {
    return await this.modify(this.attr, query);
  }

  async delete(query = {}) {
    return await this.remove(query);
  }
}

module.exports = Model;
