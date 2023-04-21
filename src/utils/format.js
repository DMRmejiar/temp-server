const formatDate = (date) => {
  console.log(date.toJSON());
  return date.toJSON().slice(0, 19).replace("T", " ");
};

module.exports = { formatDate };
