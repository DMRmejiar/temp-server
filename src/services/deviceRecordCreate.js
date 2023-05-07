const { createOne, select } = require("../lib/database");

const deviceRecordCreate = async (payload) => {
  console.log(payload);
  try {
    const timestamp = new Date();
    const devices = await select("devices", `name = '${payload.device}'`);
    if (!devices[0]) throw `Not founde device ${payload.device}`;
    const storedData = {
      deviceId: `"${devices[0].id}"`,
      createdAt: `"${timestamp.getTime()}"`,
      humidity: payload.data.humidity,
      temperature: payload.data.temperature,
      pm1: payload.data.pm1,
      pm25: payload.data.pm25,
      pm10: payload.data.pm10,
    };
    return await createOne("records", storedData);
  } catch (e) {
    console.error(e);
  }
};

module.exports = { deviceRecordCreate };
