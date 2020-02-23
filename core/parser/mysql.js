"use strict";

class MySQL {
  query = "";
  table;
  query_obj;

  // Reserved keywords to be used in query objects
  reserved = {
    $and: "AND",
    $or: "OR",
    $eq: "=",
    $neq: "!=",
    $gt: ">",
    $lt: "<",
    $gte: ">=",
    $lte: "<=",
    $lim: "LIMIT",
    $ord: "ORDER BY"
  };

  constructor(obj) {
    this.setTable(obj);
  }

  /**
   * Set database table and remove the element for query object
   * @param {object} obj
   */
  setTable(obj) {
    this.table = obj.table;
    delete obj.table;
    this.query_obj = obj;
  }

  /**
   * Compose and handle data retrieval related queries
   */
  get() {
    let query_object = this.query_obj;

    if (this.count(query_object) < 1) {
      this.query = `SELECT * FROM ${this.table}`;
    } else {
      this.query = "SELECT ";

      if (query_object.fields) {
        let c = 1;
        let fields = query_object.fields;

        [...fields].forEach(el => {
          if (c == fields.length) {
            this.query += el;
          } else {
            this.query += el + ", ";
          }
          c++;
        });

        this.query += ` FROM ${this.table}`;
        delete query_object.fields;
      } else {
        this.query += `* FROM ${this.table}`;
      }

      this.query += " WHERE";
      this.traverse(query_object);
    }
    return this.query;
  }

  /**
   * Traverse through query object so as to compose query
   * @param {object} obj
   */
  traverse(obj) {
    if (this.count(obj) > 0) {
      Object.entries(obj).forEach(([key, value]) => {
        if (this.reserved[key]) {
          if (this.getType(value) == "object") {
            this.query += ` ${this.reserved[key]}`;
            this.traverse(value);
          } else {
            this.query += ` ${this.reserved[key]} ${value}`;
          }
        } else {
          if (this.getType(value) == "object") {
            this.query += ` ${key}`;
            this.traverse(value);
          } else {
            if (value == "ASC" || value == "DESC") {
              this.query += ` ${key} ${value}`;
            } else {
              this.query += ` ${key} = ${value}`;
            }
          }
        }
      });
    }
  }

  /**
   * Get the type of a variable
   * @param {mixed} element
   * @returns {string}
   */
  getType(element) {
    let r = "";

    if (typeof element == "object" && Array.isArray(element)) {
      r = "array";
    } else {
      r = typeof element;
    }

    return r;
  }

  /**
   * Count and return the number of elements in an object
   * @param {object} object
   */
  count(object) {
    return Object.keys(object).length;
  }
}

module.exports = MySQL;
