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
    return await this.create(this.filter(this.attr));
  }

  async update(query = {}) {
    return await this.modify(this.filter(this.attr), query);
  }

  async delete(query = {}) {
    return await this.remove(query);
  }

  filter() {
    let new_attr = {};

    Object.entries(this.attr).forEach(([key, value]) => {
      if (value != "-") {
        new_attr[key] = value;
      }
    });

    return new_attr;
  }
}

module.exports = Model;
