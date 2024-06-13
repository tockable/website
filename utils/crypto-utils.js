export function hexEncode(str) {
  let hex, i;
  let result = "";
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += hex.slice(-4);
  }
  return result;
}

export function hexDecode(_str) {
  let hex = _str.toString(); //force conversion
  let str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function toHex32(_string) {
  let bytes = hexEncode(_string);
  const zeroPaddingLen = 64 - bytes.length;

  for (let i = 0; i < zeroPaddingLen; i++) {
    bytes = bytes + "0";
  }

  const hex = "0x" + bytes;
  return hex;
}

export function createTaits(_layers) {
  const _traits = [];
  for (let i = 0; i < _layers.length; i++) {
    const hex = toHex32(_layers[i]);
    _traits.push(hex);
  }
  return _traits;
}
