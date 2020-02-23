const Model = require("../app/models/User");

class TrialController {
  constructor() {
    let d = new Model();

    d.attribs.id = 5;
    d.attribs.firstname = "Gabriel";
    d.attribs.lastname = "Osuobiem";

    console.log(d.add());
  }
}

module.exports = TrialController;
