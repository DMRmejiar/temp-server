const { createConnection } = require("mysql");
const config = require("../config");

const db = createConnection(config.database);

const initDb = async () => {
  const connection = await new Promise((resolve) => {
    db.connect((err) => {
      resolve(!err);
    });
  });
  if (connection) {
    console.log("Connected to Database");
  } else {
    console.log("Database Connection Failed !!!");
    throw err;
  }
  return true;
};

const createOne = async (table, data) => {
  const dataAsArray = Object.entries(data);
  let querySave = `INSERT INTO ${table} (${dataAsArray
    .map((field) => field[0])
    .join(", ")}) VALUES (${dataAsArray.map((field) => field[1]).join(", ")})`;
  return await new Promise((resolve) => {
    db.query(querySave, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });
};

const select = async (table, query = null, project = "*") => {
  let querySelect = `SELECT ${project} FROM ${table}`;
  if (query && query.length > 0) {
    /* const entries = Object.entries(query)
      .map((field) => `${field[0]} = ${field[1]}`)
      .join(" AND "); */
    querySelect += ` WHERE ${query}`;
  }
  return await new Promise((resolve) => {
    db.query(querySelect, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });
};

module.exports = { db, initDb, createOne, select };
