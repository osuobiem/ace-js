const MySQL = require("../../core/mysql");

class User extends MySQL {
  attribs = {
    id: "-",
    firstname: "-",
    lastname: "-"
  };

  constructor() {
    super("users");
  }

  get(obj = {}) {
    return this.read(obj);
  }

  add() {
    return this.create(filter(this.attribs));
  }

  update() {}

  filter() {
    let new_attribs = {};

    Object.entries(this.attribs).forEach(([key, value]) => {
      if (value != "-") {
        new_attribs[key] = value;
      }
    });

    return new_attribs;
  }
}

module.exports = User;
