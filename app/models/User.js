const Parser = require("../../core/parser/mysql");

class User {
  table = "users";

  get(obj = {}) {
    obj.table = this.table;
    let p = new Parser(obj);
    return p.get();
  }
}

module.exports = User;
