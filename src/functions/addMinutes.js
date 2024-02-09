const addMinutes = (anyDate, minutes) => {
  const dt = new Date(anyDate);
  const milliseconds = dt.getTime();
  const milliseconds2 = milliseconds + 1000 * 60 * minutes;
  return new Date(milliseconds2);
};

module.exports = addMinutes;
