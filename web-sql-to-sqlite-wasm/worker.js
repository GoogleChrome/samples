import { default as sqlite3InitModule } from './sqlite3.mjs';

const log = (...messages) => console.info(...messages);
const error = (...messages) => console.error(...messages);

const createSQLiteDatabase = (sqlite3, database, sql) => {  
  log(
    'SQLite3 version',
    sqlite3.capi.sqlite3_libversion(),
    sqlite3.capi.sqlite3_sourceid()
  );
  let db;
  const fileName = `/${database}.db`;
  if (sqlite3.opfs) {
    db = new sqlite3.oo1.OpfsDb(fileName);
    log('The OPFS is available.');
  } else {
    db = new sqlite3.oo1.DB(fileName, 'ct');
    log('The OPFS is not available.');
  }
  log('Transient db =', db.filename);

  try {
    sql.split(';').forEach((sqlStatement) => {
      sqlStatement += ';';      
      db.exec(sqlStatement);
    });
  } catch (err) {
    db.close();
    console.error(err.name, err.message);
    self.postMessage({
      message: 'errorSQLiteDatabase',
      error: `${err.name}: ${err.message}`,
    });
    return;
  }
  self.postMessage({
    message: 'createdSQLiteDatabase'      
  });
};

self.sqlite3InitModule().then(function (sqlite3) {
  try {
    self.addEventListener('message', async (e) => {
      console.log('👷 In Worker, message from main thread', e.data);
      if (e.data.message === 'createSQLiteDatabase') {
        if (!e.data.sql || !e.data.database) {
          return;
        }
        try {
          await (await navigator.storage.getDirectory()).remove({recursive: true})
          console.log('👷 In Worker, deleted the OPFS');
        } catch (err) {
          
        }
        createSQLiteDatabase(sqlite3, e.data.database, e.data.sql);
      }
    });
  } catch (e) {
    error('Exception:', e.message);
  }
});
