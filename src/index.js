const express = require("express");
const { db, initDb } = require("./lib/database.js");
const { iot, initIot } = require("./lib/iot.js");
const { deviceRecordCreate } = require("./services/deviceRecordCreate.js");
const { getLastResults } = require("./services/getLastResults.js");

const app = express();

const testCreate = () => {
  const temp =
    '{"date":"2023-21-04","device":"esp32_01_e3","sensors":{"pms":"pms7003","dht":"dth22"},"data":{"humidity":73.69999695,"temperature":24.29999924,"pm1":4,"pm25":5,"pm10":7}}';
  // const queryCreateTable = "SELECT * FROM records";
  // "DROP TABLE Records"
  /* "CREATE TABLE records (\n" +
    "id INT NOT NULL AUTO_INCREMENT,\n" +
    "device varchar(11) NOT NULL,\n" +
    "date timestamp NOT NULL DEFAULT current_timestamp(),\n" + // created_at BIGINT(20) NOT NULL
    "humidity FLOAT(10) NOT NULL,\n" +
    "temperature FLOAT(10) NOT NULL,\n" +
    "pm1 INT(10) NOT NULL,\n" +
    "pm25 INT(10) NOT NULL,\n" +
    "pm10 INT(10) NOT NULL,\n" +
    "PRIMARY KEY (id)\n" +
    ")"; */
  deviceRecordCreate(JSON.parse(temp.toString()));
  /* db.query(queryCreateTable, (err, rows) => {
    if (err) throw new Error(err);
    console.log(rows);
  }); */
};

const getAll = () => {
  const temp =
    '{"date":"2023-21-04","device":"esp32_01_e3","sensors":{"pms":"pms7003","dht":"dth22"},"data":{"humidity":73.69999695,"temperature":24.29999924,"pm1":4,"pm25":5,"pm10":7}}';
  const queryCreateTable = "SELECT * FROM records";
  db.query(queryCreateTable, (err, rows) => {
    if (err) throw new Error(err);
    console.log(rows);
  });
};

const runServer = async () => {
  await Promise.all([initDb(), initIot()]);

  iot.on("message", (_, payload) => {
    deviceRecordCreate(JSON.parse(payload.toString()));
  });

  app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000\nhttp://localhost:3000");
  });

  app.get("/results", getLastResults);
  app.get("/create", (_, __) => testCreate());
  app.get("/all", (_, __) => getAll());
  //testFunction();
};

runServer();

/* app.get("/createDatabase", (req, res) => {
  let databaseName = "data_collector";
  db.query("CREATE DATABASE data_collector", (err) => {
    if (err) throw err;
    console.log("Database Created Successfully !");
    let useQuery = `USE ${databaseName}`;
    db.query(useQuery, (error) => {
      if (error) throw error;
      console.log("Using Database");
      return res.send(`Created and Using ${databaseName} Database`);
    });
  });
}); */
