"use strict";

const UserModel = require("../models/User");

let user = new UserModel();

module.exports = {
  async get() {
    return await user.get();
  }
};
