const { createOne } = require("../lib/database");
const { formatDate } = require("../utils/format");

const deviceRecordCreate = async (payload) => {
  const timestamp = new Date();
  const storedData = {
    device: `"${payload.device}"`,
    date: `"${formatDate(timestamp)}"`,
    humidity: payload.data.humidity,
    temperature: payload.data.temperature,
    pm1: payload.data.pm1,
    pm25: payload.data.pm25,
    pm10: payload.data.pm10,
  };
  return await createOne("records", storedData);
};

module.exports = { deviceRecordCreate };
