// Atom uses RFC 3339 dates
// https://tools.ietf.org/html/rfc3339#section-5.8
export default function(dateObj) {
  let s = dateObj.toISOString();

  // remove milliseconds
  let split = s.split(".");
  split.pop();

  return split.join("") + "Z";
}
