"use strict";

const UserModel = require("../models/User");

let user = new UserModel();

module.exports = {
  async get() {
    return await user.get({
      id: {
        $lt: 10
      },
      $ord: {
        firstname: "ASC"
      }
    });
  },

  async create(data) {
    user.attr = data;

    return await user.add();
  },

  async update(data, id) {
    user.attr = data;

    return await user.update({
      id
    });
  },

  async delete(id) {
    return await user.delete({
      id
    });
  }
};
