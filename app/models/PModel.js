const Parser = require("../../core/parser");

class PModel extends Parser {
  get(obj) {
    let sql = this.traverse(obj);
    console.log(sql);
  }
}
