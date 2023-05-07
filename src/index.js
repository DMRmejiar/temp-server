const express = require("express");
const { db, initDb, createOne } = require("./lib/database.js");
const { iot, initIot } = require("./lib/iot.js");
const { deviceRecordCreate } = require("./services/deviceRecordCreate.js");
const { getLastResults } = require("./services/getLastResults.js");

const app = express();

const testFunction = () => {
  const temp =
    '{"date":"2023-21-04","device":"esp32_01","sensors":{"pms":"pms7003","dht":"dth22"},"data":{"humidity":73.69999695,"temperature":24.29999924,"pm1":4,"pm25":5,"pm10":7}}';
  const queryCreateTable =
    // "INSERT INTO users "
    "SELECT * FROM records";
   //"DROP TABLE records"
 /*  "CREATE TABLE records (\n" +
    "id INT NOT NULL AUTO_INCREMENT,\n" +
    "deviceId INT NOT NULL,\n" +
    "createdAt BIGINT(20) NOT NULL,\n" +
    "humidity FLOAT(10) NOT NULL,\n" +
    "temperature FLOAT(10) NOT NULL,\n" +
    "pm1 INT(10) NOT NULL,\n" +
    "pm25 INT(10) NOT NULL,\n" +
    "pm10 INT(10) NOT NULL,\n" +
    "PRIMARY KEY (id),\n" +
    "FOREIGN KEY (deviceId) REFERENCES devices(id)\n" +
    ")"; */
  /* "CREATE TABLE users (\n" +
    "id INT NOT NULL AUTO_INCREMENT,\n" +
    "name varchar(50) NOT NULL,\n" +
    "email varchar(50) NOT NULL,\n" +
    "phone varchar(10) NOT NULL,\n" +
    "address varchar(100) NOT NULL,\n" +
    "PRIMARY KEY (id)\n" +
    ")"; */
  /* "CREATE TABLE devices (\n" +
    "id INT NOT NULL AUTO_INCREMENT,\n" +
    "userId INT NOT NULL,\n" +
    "name varchar(20) NOT NULL,\n" +
    "type varchar(10) NOT NULL,\n" +
    "version varchar(10) NOT NULL,\n" +
    "location POINT NOT NULL,\n" +
    "PRIMARY KEY (id),\n" +
    "FOREIGN KEY (userId) REFERENCES users(id)\n" +
    ")"; */
  //deviceRecordCreate(JSON.parse(temp.toString()));
  db.query(queryCreateTable, (err, rows) => {
    if (err) throw new Error(err);
    console.log(rows);
  });
  /* createOne("devices", {
    userId: 1,
    name: '"esp32_01"',
    type: '"esp32"',
    version: '"0.0.1"',
    location: 'POINT(6.15442, -75.60834)'
  }).then((event) => {
    console.log(event);
  }); */
};

const getAll = (res) => {
  const queryCreateTable = "SELECT * FROM records";
  db.query(queryCreateTable, (err, rows) => {
    if (err) throw new Error(err);
    res.json(rows);
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
  app.get("/all", (_, res) => {
    getAll(res);
  });
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
