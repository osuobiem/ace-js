const Model = require("../app/models/PModel");

class TrialController {
  get() {
    let d = new Model();
    d.get();
  }
}
