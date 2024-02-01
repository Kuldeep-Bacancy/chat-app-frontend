export const formatTimestamp = (dateVal) => {
  let newDate = new Date(dateVal);

  let sMonth = padValue(newDate.getMonth() + 1);
  let sDay = padValue(newDate.getDate());
  let sYear = newDate.getFullYear();
  let sHour = newDate.getHours();
  let sMinute = padValue(newDate.getMinutes());
  let sAMPM = "AM";

  let iHourCheck = parseInt(sHour);

  if (iHourCheck >= 12) {
    sAMPM = "PM";
    sHour = iHourCheck - 12;
  }
  else if (iHourCheck === 0) {
    sHour = "12";
  }

  sHour = padValue(sHour);

  return `Sent on ${sDay}-${sMonth}-${sYear} - ${sHour}:${sMinute} ${sAMPM}`
}

const padValue = (value) => {
  return (value < 10) ? "0" + value : value;
}