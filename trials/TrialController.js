const Model = require("../app/models/User");

class TrialController {
  constructor() {
    let f = {
      fields: ["id", "firstname", "lastname"],
      id: 3,
      $and: {
        firstname: "Gabriel",
        $or: {
          lastname: "tanz"
        }
      }
    };
    let d = new Model();
    console.log(d.get(f));
  }
}

module.exports = TrialController;
