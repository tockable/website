/**
 *
 * @param {*} str
 * @param {*} isFirstCapital
 * @returns
 */
export function camelize(str, isFirstCapital = false) {
  let newStr = str
    .trim()
    .replace(/[^a-z0-9 .]/gi, "")
    .replace(/^\d+/g, "")
    .replace(/^ +/g, "")
    .replace(".", " ")
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });

  if (isFirstCapital) {
    let firstLetter = newStr.charAt(0);
    newStr = firstLetter.toUpperCase() + newStr.substring(1);
  }

  return newStr;
}

/**
 *
 * @param {*} _str
 * @returns
 */
export function extractSlug(_str) {
  let str = _str.split("/");
  return `${str[str.length - 1]}`;
}

export function capitalize(_str) {
  const fl = _str.charAt(0);
  const flc = fl.toUpperCase();
  const rl = _str.slice(1);

  return flc + rl;
}

export function getDate(_timestamp) {
  const date = new Date(Number(_timestamp));
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();

  const formattedTime =
    year + "/" + month + "/" + day + " " + hours + ":" + minutes.slice(-2);
    
  return formattedTime;
}
