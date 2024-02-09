export const formatDate = (anyDate) => {
  dt = new Date(anyDate);
  const year = dt.getFullYear();
  const day = dt.getDate();
  let month = (Number(dt.getMonth()) + 1).toString();
  if (month.length < 2) month = `0${month}`;
  return `${year}-${month}-${day}`;
};
