const Model = require("../app/models/User");

class TrialController {
  constructor() {
    let d = new Model();

    d.attr.id = 5;
    d.attr.firstname = "Gabriel";
    d.attr.lastname = "Osuobiem";

    console.log(d.add());
  }
}

module.exports = TrialController;
