const webSQLCreateButton = document.querySelector('.button-web-sql-create');
const webSQLDumpButton = document.querySelector('.button-web-sql-dump');
const sqliteWasmButton = document.querySelector('.button-sqlite-wasm');
const webSQLDeleteButton = document.querySelector('.button-web-sql-delete');

const pre = document.querySelector('.messages');

const worker = new Worker('worker.js', { type: 'module' });

let sql;
let database;
let db;

worker.addEventListener('message', (e) => {
  console.log('🧵 In main thread, message from Worker', e.data);
  if (e.data.message === 'createdSQLiteDatabase') {
    pre.textContent = 'SQLite database created.';
  } else if (e.data.message === 'errorSQLiteDatabase') {
    pre.textContent = e.data.error;
  }
});

const createWebSQLDatabase = () => {
  openDatabase(
    // Name
    'mydatabase',
    // Version
    '',
    // Display name
    'mydatabase',
    // Estimated size
    1024,
    // Creation callback
    function (_db) {
      db = _db;
      db.transaction(
        // Transaction callback
        function (tx) {
          // Execute SQL statement
          tx.executeSql(
            // SQL statement
            'create table rainstorms (mood text, severity int)',
            // Arguments
            [],
            // Success callback
            function () {
              // Execute SQL statement
              tx.executeSql(
                // SQL statement
                "insert into rainstorms values ('somber', 6), ('rainy', 8), ('stormy', 2)"
              );
            }
          );
        },
        // Error callback
        function (err) {
          console.error(err.name, err.message);
          pre.textContent = `${err.name}: ${err.message}.`;
        },
        // Success callback);
        function () {
          console.log('Transaction succeeded!');
        }
      );
    }
  );
  pre.textContent = 'Web SQL database created.';
};

const createSQLiteDatabase = () => {
  worker.postMessage({
    message: 'createSQLiteDatabase',
    sql,
    database,
  });
};

const dumpWebSQLDatabase = (_database = 'mydatabase', _version = '') => {
  window.websqldump.export({
    database: _database,
    version: _version,
    success: function (_sql) {
      pre.textContent = _sql.split(/;\s*/).join(';\n');
      sql = _sql;
      database = _database;
    },
    error: function (err) {
      console.error(err);
      pre.textContent = err;
    },
  });
};

const dropAllTables = () => {
  try {
    db.transaction(function (tx) {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' and name !='__WebKitDatabaseInfoTable__'",
        [],
        function (tx, result) {
          const len = result.rows.length;
          const tableNames = [];
          for (let i = 0; i < len; i++) {
            const tableName = result.rows.item(i).name;
            tableNames.push(`'${tableName}'`);
            db.transaction(function (tx) {
              tx.executeSql('DROP TABLE ' + tableName);              
            });
          }
          pre.textContent = `Dropped table${tableNames.length > 1 ? 's' : ''}: ${tableNames.join(', ')}.`;
        }
      );
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
};

webSQLCreateButton.addEventListener('click', () => createWebSQLDatabase());

webSQLDumpButton.addEventListener('click', () => dumpWebSQLDatabase());

sqliteWasmButton.addEventListener('click', () => createSQLiteDatabase());

webSQLDeleteButton.addEventListener('click', () => dropAllTables());
