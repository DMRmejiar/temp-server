const { select } = require("../lib/database");

const fieldMean = (list, device, field) => {
  const filteredList = list
    .filter((item) => item.deviceId === device)
    .map((item) => item[field]);
  console.log(filteredList);
  return (
    filteredList.reduce((prev, curr) => prev + curr, 0) / filteredList.length
  );
};

const getLastResults = async (_, res) => {
  const tempDate = new Date();
  let from = new Date(tempDate);
  let to = new Date(tempDate);
  from.setHours(
    from.getHours() - (from.getMinutes() > 30 ? 0 : 1),
    from.getMinutes() > 30 ? 0 : 30,
    0,
    0
  );
  to.setHours(to.getHours(), to.getMinutes() > 0 ? 30 : 0, 0, 0);
  console.log(`Search in range ${from} to ${to}`);
  const dbResults = await select(
    "records",
    `createdAt BETWEEN ${from.getTime()} AND ${to.getTime()}`
  );
  console.log(dbResults);
  const devices = [...new Set(dbResults.map((rows) => rows.deviceId))];
  const data = await Promise.all(
    devices.map(async (device) => {
      console.log(device);
      const deviceData = await select("devices", `id = ${device}`);
      return {
        device: deviceData[0].name,
        location: deviceData[0].location,
        data: {
          pm1: fieldMean(dbResults, device, "pm1"),
          pm25: fieldMean(dbResults, device, "pm25"),
          pm10: fieldMean(dbResults, device, "pm10"),
        },
      };
    })
  );
  return res.json(data);
};

module.exports = { getLastResults };
