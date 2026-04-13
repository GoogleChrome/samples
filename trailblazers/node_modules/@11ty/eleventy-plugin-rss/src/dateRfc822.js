export default function pubDateRFC822(value, timeZone = undefined) {
  const date = new Date(value);
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',

    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',

    timeZone: timeZone,
    timeZoneName: 'longOffset',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  const [wkd, mmm, dd, yyyy, time, z] = formattedDate.replace(/([,\s]+)/g, ' ').split(' ');
  const tz = z.replace(/GMT(?<sign>\+|\-)(?<hour>\d\d):(?<minute>\d\d)/, '$<sign>$<hour>$<minute>');

  return `${wkd}, ${dd} ${mmm} ${yyyy} ${time} ${tz}`;
}
