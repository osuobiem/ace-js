const Parser = require("../../core/mysql");

class User {
  table = "users";
  attribs = {
    id: "",
    firstname: "",
    lastname: ""
  };

  get(obj = {}) {
    obj.table = this.table;
    let p = new Parser(obj);
    return p.get();
  }

  add() {
    let obj = this.attribs;
    obj.table = this.table;
    let p = new Parser(obj);
    return p.add();
  }
}

module.exports = User;
