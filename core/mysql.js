const mysql = require('mysql');

const config = require('../../config');

class MySQL {
    constructor() {
        this.db = mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
        });
        this.connected = false;
    }

    // connect to database
    connect() {
        let instance = this;
        this.db.connect(function(err) {
            if (err) throw err;
            console.log('Connected to MySQL database!');
            instance.connected = true;
        })
    }

    // disconnect from database
    disconnect() {
        this.connected = false;
        console.log('Disconnected from MySQL database!')
    }

    /**
     * Build MySQL query
     * @param {Object} options - has the form
     * {
     *  query: sql_query,
     *  values: [value_1, value_2, ...]
     * }
     */
    build(query, values = []) {
        return new Promise((resolve, reject) => {
            this.db.query(query, values, function(err, results, fields) {
                if (err) {
                    console.log(err, { message: 'Database Error' }, { methodName: 'MySQL.build' });
                } else {
                    resolve({ results: results });
                }
            })
        });
    }

    /**
     * Fetch data from database using SELECT statement
     * @param {Object} options - has the form
     * {
     *  table: table_name,
     *  field: single_field_string | [field1, field2, ...],
     * }
     */
    select(options) {
        let fieldList;

        // determine options given in options
        if (this.checkType(options, 'array')) {
            options.field = options.field.toString();
        }

        return {
            status: true,
            query: `SELECT ${options.field} FROM ${config.db.database}.${options.table}`,
        }
    }

    /**
     * Contruct query with WHERE clause
     * @param {Object} options - has the form
     * {
     *  key: key,
     *  condition: = | < | > | != | <= | >=,
     *  value: value,
     * }
     */
    where(options) {
        return {
            value: options.value,
            query: ` WHERE ${options.key} ${options.condition} ?`,
        }
    }

    /**
     * Contruct query with AND condition
     * @param {Object} options - has the form
     * {
     *  key: key,
     *  condition: = | < | > | != | <= | >=,
     *  value: value,
     * }
     */
    and(options) {
        return {
            value: options.value,
            query: ` AND ${options.key} ${options.condition} ?`,
        }
    }

    /**
     * Contruct query with OR condition
     * @param {Object} options - has the form
     * {
     *  key: key,
     *  condition: = | < | > | != | <= | >=,
     *  value: value,
     * }
     */
    or(options) {
        return {
            value: options.value,
            query: ` OR ${options.key} ${options.condition} ?`,
        }
    }

    /**
     * Contruct query with ORDER BY
     * @param {Object} options - has the form
     * {
     *  order: ASC | DESC,
     *  field: field,
     * }
     */
    orderBy(options) {
        return ` ORDER BY ${options.field} ${options.order}`;
    }

    /**
     * Contruct query with LIMIT
     * @param {number} lim
     */
    limit(lim) {
        return ` LIMIT ${lim}`;
    }

    /**
     * Insert data into database using INSERT statement
     * @param {Object} options - has the form
     * {
     *  table: table_name
     *  field: single_field_string | [field1, field2, ...],
     *  value: single_value_string | [value1, value2, ...]
     * }
     */
    insert(options) {
        let q;
        let result = {};

        if (this.checkType(options.field, 'array') && this.checkType(options.value, 'array')) {
            let field = options.field.toString();
            q = `INSERT INTO ${config.db.database}.${options.table} (${field}) VALUES (`;
            for (let i = 0; i < options.value.length; i++) {
                (i + 1 === options.value.length) ? q += ' ? )': q += ' ?,';
            }
            result.status = true;
            result.query = q;
            console.log(result);
            return result;
        } else if (this.checkType(options.field, 'string') && this.checkType(options.value, 'string')) {
            q = `INSERT INTO ${config.db.database}.${options.table} (${options.field}) VALUES (?)`;
            result.status = true;
            result.query = q;
            console.log(result);
            return result;
        } else {
            result.status = false;
            console.log({ message: 'field and value length mismatch' }, { methodName: 'MySQL.insert' }, );
            return result;
        }
    }

    /**
     * Update data using UPDATE statement
     * @param {Object} options - has the form
     * {
     *  table: table_name
     *  field: single_field_string | [field1, field2, ...],
     *  value: single_value_string | [value1, value2, ...]
     * }
     */
    update(options) {
        let q;
        let result = { status: false, query: '', };
        if (this.checkType(options.field, 'array') && this.checkType(options.value, 'array')) {

            q = `UPDATE ${config.db.database}.${options.table} SET`;
            for (let i = 0; i < options.value.length; i++) {
                (i + 1 === options.value.length) ? q += ` ${options.field[i]} = ?`: q += ` ${options.field[i]} = ?,`;
            }
            result.status = true;
            result.query = q;
            console.log(result);
            return result;
        } else if (this.checkType(options.field, 'string') && this.checkType(options.value, 'string')) {
            q = `UPDATE ${config.db.database}.${options.table} SET ${options.field} = ?`;
            result.status = true;
            result.query = q;
            console.log(result);
            return result;
        } else {
            result.status = false;
            console.log({ message: 'field and value length mismatch' }, { methodName: 'MySQL.update' }, );
            return result;
        }
    }

    /**
     * Delete data from database using DELETE statement
     * @param {Object} options - has the form
     * {
     *  table: table_name,
     * }
     */
    delete(options) {
        return {
            status: true,
            query: `DELETE FROM ${options.table} `
        }
    }

    /**
     * Check variable type
     * @param {any} variable 
     * @param {String} type
     */
    checkType(variable, type) {
        if (type === 'array') {
            return Array.isArray(variable);
        } else {
            return (typeof variable === type);
        }
    }
}

module.exports = MySQL;