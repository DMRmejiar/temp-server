const { select } = require("../lib/database");
const { formatDate } = require("../utils/format");

const fieldMean = (list, device, field) => {
  const filteredList = list
    .filter((item) => item.device === device)
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
    from.getHours() - 4 - (from.getMinutes() > 30 ? 0 : 1),
    from.getMinutes() > 30 ? 0 : 30,
    0,
    0
  );
  to.setHours(to.getHours() + 7, to.getMinutes() > 0 ? 30 : 0, 0, 0);
  const dbResults = await select(
    "records"
    /*, `'date' >= UNIX_TIMESTAMP('${formatDate(
      from
    )}') AND 'date' < UNIX_TIMESTAMP('${formatDate(to)}')` */
  );
  console.log(dbResults);
  const devices = [...new Set(dbResults.map((rows) => rows.device))];
  const data = devices.map((device) => {
    return {
      device: device,
      data: {
        pm1: fieldMean(dbResults, device, "pm1"),
        pm25: fieldMean(dbResults, device, "pm25"),
        pm10: fieldMean(dbResults, device, "pm10"),
      },
    };
  });
  return res.json(data);
};

module.exports = { getLastResults };
