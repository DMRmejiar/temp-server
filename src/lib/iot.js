const { device } = require("aws-iot-device-sdk");
const config = require("../config");

const iot = device(config.iotCore);

const initIot = async () => {
  const connection = await new Promise((resolve) => {
    iot.on("connect", () => {
      resolve(true);
    });
  });
  if (connection) {
    console.log("Conectado a AWS IoT Core");
    iot.subscribe(config.iotCore.topic);
  }
  return connection;
};

module.exports = { initIot, iot };
