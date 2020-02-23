const Model = require("../app/models/User");

class TrialController {
  constructor() {
    let d = new Model();

    let a = {
      firstname: "Gabriel",
      $and: {
        id: {
          $lte: 34
        }
      }
    };

    console.log(d.delete(a));
  }
}

module.exports = TrialController;
