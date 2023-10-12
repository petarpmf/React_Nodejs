module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "admin",
  DB: "testdb_reactjs_nodejs",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
