"use strict";

const Database = require("../db");

class Model extends Database {
  attr = {};

  constructor(table) {
    super(table);
  }

  get(query = {}) {
    return this.read(query);
  }

  add() {
    return this.create(this.filter(this.attr));
  }

  update(query = {}) {
    return this.modify(this.filter(this.attr), query);
  }

  delete(query = {}) {
    return this.remove(query);
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
