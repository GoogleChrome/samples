/*
 * websqldump.js v1.0.0
 * Copyright 2016 Steven de Salas
 * http://github.com/sdesalas/websqldump
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function (window, undefined) {
  var wd = {};

  // Default config
  wd.config = {
    database: undefined,
    table: undefined, // undefined to export all tables
    version: '1.0',
    info: '',
    dbsize: 5 * 1024 * 1024, // 5MB
    linebreaks: false,
    schemaonly: false,
    dataonly: false,
    success: function (sql) {
      console.log(sql);
    },
    error: function (message) {
      throw new Error(message);
    },
  };

  wd.exportTable = function (config) {
    // Use closure to avoid overwrites
    var table = config.table;
    // Export schema
    if (!config.dataonly) {
      wd.execute({
        db: config.db,
        sql: "SELECT sql FROM sqlite_master WHERE type='table' AND tbl_name=?;",
        params: [table],
        success: function (results) {
          if (!results.rows || !results.rows.length) {
            if (typeof config.error === 'function')
              config.error('No such table: ' + table);
            return;
          }
          // @tomayac: Modified from https://github.com/sdesalas/websqldump/blob/master/websqldump.js,
          // to replace `CREATE TABLE` with `CREATE TABLE IF NOT EXISTS`.
          var sql = results.rows.item(0)['sql'];
          sql = sql.replace(
            /create\s+table\s+(?!if not exists)/gimu,
            'CREATE TABLE IF NOT EXISTS '
          );
          config.exportSql.push(sql);
          if (config.schemaonly) {
            if (typeof config.success === 'function')
              config.success(config.exportSql.toString());
            return;
          }
        },
      });
    }
    // Export data
    if (!config.schemaonly) {
      wd.execute({
        db: config.db,
        sql: "SELECT * FROM '" + table + "';",
        success: function (results) {
          if (results.rows && results.rows.length) {
            for (var i = 0; i < results.rows.length; i++) {
              var row = results.rows.item(i);
              var _fields = [];
              var _values = [];
              for (var col in row) {
                _fields.push(col);
                // @tomayac: Modified from https://github.com/sdesalas/websqldump/blob/master/websqldump.js,
                // since the values in `VALUES()` apparently need to be surrounded by `'` and not `"`.
                _values.push("'" + row[col] + "'");
              }
              config.exportSql.push(
                'INSERT INTO ' +
                  table +
                  '(' +
                  _fields.join(',') +
                  ') VALUES (' +
                  _values.join(',') +
                  ')'
              );
            }
          }
          if (typeof config.success === 'function')
            config.success(config.exportSql.toString());
        },
        error: function (err) {
          if (typeof config.error === 'function') config.error(err);
        },
      });
    }
  };

  wd.export = function (config) {
    // Apply defaults
    for (var prop in wd.config) {
      if (typeof config[prop] === 'undefined') config[prop] = wd.config[prop];
    }
    config.db = wd.open(config);
    config.exportSql = config.exportSql || [];
    config.exportSql.toString = function () {
      return this.join(config.linebreaks ? ';\n' : '; ') + ';';
    };
    if (config.table) {
      wd.exportTable(config);
    } else {
      config.exported = []; // list of exported tables
      config.outstanding = []; // list of outstanding tables
      var success = config.success;
      config.success = function () {
        config.exported.push(config.table);
        // Check if its all done
        if (config.exported.length >= config.outstanding.length) {
          if (typeof success === 'function')
            success(config.exportSql.toString());
        }
      };
      // Export all tables in db
      wd.execute({
        db: config.db,
        sql: "SELECT tbl_name FROM sqlite_master WHERE type='table';",
        success: function (results) {
          if (results.rows) {
            // First count the outstanding tables
            var tbl_name;
            for (var i = 0; i < results.rows.length; i++) {
              tbl_name = results.rows.item(i)['tbl_name'];
              if (tbl_name.indexOf('__WebKit') !== 0)
                // skip webkit internals
                config.outstanding.push(tbl_name);
            }
            // Then export them
            for (var i = 0; i < config.outstanding.length; i++) {
              config.table = config.outstanding[i];
              wd.exportTable(config);
            }
          }
        },
        error: function (err) {
          if (typeof error === 'function') error(transaction, err);
        },
      });
    }
  };

  wd.open = function (config) {
    if (!config) throw new Error('Please use a config object');
    if (!config.database)
      throw new Error('Please define a config database name.');
    // @tomayac: Modified from https://github.com/sdesalas/websqldump/blob/master/websqldump.js,
    // since it doesn't allow a `''` as the version.
    return window.openDatabase(
      config.database,
      config.version,
      config.info || '',
      config.dbsize || 512000
    );
  };

  // Helper method for executing SQL code in DB
  wd.execute = function (config) {
    if (!config) throw new Error('Please use a config object');
    if (!config.db)
      throw new Error('Please define a db obj to execute against');
    if (!config.sql) throw new Error('Please define some sql to execute.');
    config.db.transaction(function (transaction) {
      transaction.executeSql(
        config.sql,
        config.params || [],
        function (transaction, results) {
          if (typeof config.success === 'function') config.success(results);
        },
        function (transaction, err) {
          if (typeof config.error === 'function') config.error(err);
        }
      );
    });
  };

  window.websqldump = {
    export: function () {
      wd.export.apply(wd, arguments);
    },
  };
})(this);
