const db = require('../../core/db')

class Model {
  constructor (table) {
    this.table = table
    this.query = ''
    this.values = []
    this.id = 0
  }

  async run () {
    if (this.query === '') {
      return {
        status: false,
        data: { message: 'Query is empty' }
      }
    } else {
      return await db.build(this.query, this.values)
    }
  }

  /**
   * Get data from database
   * @param {String, Array} field //data field/column to select
   */
  select (field) {
    let options = {
      field: field,
      table: table
    }

    this.reset().query = db.select(options).query
    return this
  }

  /**
   * Insert data into database
   * @param {Object} options - has the form
   * {
   *   field: single_field_string | [field1, field2, ...],
   *   value: signle_value | [value1, value2, ...]
   * }
   */
  async insert (options) {
    this.setTableName(options)

    if (db.insert(options).status === false) {
      return { status: false, meesage: 'Database Error!' }
    } else {
      this.reset().query = db.insert(options).query
      if (db.checkType(options.value, 'array')) {
        for (let i = 0; i < options.value.length; i++) {
          this.values.push(options.value[i])
        }
      } else {
        this.values.push(options.value)
      }

      return await {
        status: true,
        data: this.run().insertId
      }
    }
  }

  /**
   * Update data in database
   * @param {String} field //data field/column to update
   * @param {*} value //value to be used for update
   */
  update (field, value) {
    let options = {
      field: field,
      value: value
    }
    this.setTableName(options)

    if (db.update(options).status === false) {
      return { status: false, message: 'Database Error!' }
    } else {
      this.reset().query = db.update(options).query
      if (db.checkType(options.value, 'array')) {
        for (let i = 0; i < options.value.length; i++) {
          this.values.push(options.value[i])
        }
      } else {
        this.values.push(options.value)
      }
      return this
    }
  }

  /**
   * Append optional WHERE clause for specificity
   * @param {String} field //data field/column
   * @param {*} value //data value
   * @param {*} cond //condition = (default), >, <, !=, <=, =>
   */
  where (field, value, cond = '=') {
    let options = {
      field: field,
      condition: cond,
      value: value
    }

    this.query += db.where(options).query
    this.values.push(options.value)

    return this
  }

  /**
   * Append optional AND for specificity
   * @param {String} field //data field/column
   * @param {*} value //data value
   * @param {*} cond //condition = (default), >, <, !=, <=, =>
   */
  and (key, value, cond = '=') {
    let options = {
      key: key,
      condition: cond,
      value: value
    }

    this.query += db.and(options).query
    this.values.push(options.value)

    return this
  }

  /**
   * Append optional OR for specificity
   * @param {String} field //data field/column
   * @param {*} value //data value
   * @param {*} cond //condition; = (default), >, <, !=, <=, =>
   */
  or (key, value, cond = '=') {
    let options = {
      key: key,
      condition: cond,
      value: value
    }

    this.query += db.or(options).query
    this.values.push(options.value)

    return this
  }

  /**
   * Append optional ORDER BY to specify result order
   * @param {String} field //data field/column
   * @param {String} order //result order; ASC (default), DESC
   */
  orderBy (field, order) {
    this.query += db.orderBy({ field: field, order: order })

    return this
  }

  async get (num = 0) {
    if (num > 0) {
      this.query += db.limit(num)
    }
    return await this.run()
  }

  async all (feedback) {
    let options = {
      table: this.table,
      field: '*'
    }
    this.reset().query = db.select(options).query
    return await this.run()
  }

  delete () {
    let options = {
      table: this.table
    }
    if (db.delete(options).status === false) {
      return { status: false, message: 'Database Error!' }
    } else {
      this.reset().query = db.delete(options).query

      return this
    }
  }

  reset () {
    this.query = ''
    this.values = []
    return this
  }

  async count () {
    return await this.run().length
  }

  async exists () {
    const results = await this.count()
    return !(results < 1)
  }

  setTableName (options) {
    return (options.table = this.table)
  }

  async find (id, feedback) {
    let ins = this
    this.select('*') + this.where('id', id)
    const results = await this.run()
    if (results.length > 0) {
      ins.id = id
    }
    return results
  }

  hasMany (child, feedback, key = this.id) {
    this.reset()
    let parent = this.tablesMapper(child)
    if (key === 0) {
      return feedback({
        status: false,
        message: 'Invalid object: Use find(id) before this'
      })
    } else {
      this.select('*', child) + this.where(parent, key)
      this.run(function (results) {
        return feedback(results)
      })
    }
  }

  belongsTo (parent, feedback, key = this.id) {
    this.reset()
    if (key === 0) {
      return feedback({
        status: false,
        message: 'Invalid object: Use find(id) before this'
      })
    } else {
      let ins = this
      this.find(key, function (results) {
        if (results.length > 0) {
          results.forEach(element => {
            ins.reset()
            ins.select('*', parent) +
              ins.where('id', element[ins.tablesMapper(parent)])
            ins.run(function (res) {
              return feedback(res)
            })
          })
        }
      })
    }
  }

  tablesMapper (table) {
    const tables = {
      lgas: 'state_id',
      sub_categories: 'category_id',
      categories: 'category_id',
      states: 'state_id'
    }
    return tables[table]
  }
}

module.exports = Model
