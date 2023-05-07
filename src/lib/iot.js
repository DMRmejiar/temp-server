const { device } = require("aws-iot-device-sdk");
const config = require("../config");

const iot = device(config.iotCore);

const initIot = async () => {
  const connection = await new Promise((resolve) => {
    iot.on("connect", () => {
      resolve(true);
    });
  });
  iot.on("error", (topic, payload) => {
    console.log("Error:", topic, payload);
    initIoT();
  });
  if (connection) {
    console.log("Conectado a AWS IoT Core");
    iot.subscribe(config.iotCore.topic);
  }
  iot.on("reconnect", () => {
    console.log("Se perdió la conexión, intentando reconectar...");
    iot.reconnect();
  });
  return connection;
};

module.exports = { initIot, iot };
