/**
 *
 * @param {*} buffer
 * @param {*} image
 * @returns
 */
export function arrayBufferToBase64(buffer, image) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  let base64 = btoa(binary);

  return `data:${image.type};base64,${base64}`;
}

/**
 *
 * @param {*} blob
 * @returns
 */
export function blobToBase64(blob) {
  let reader = new FileReader();

  reader.readAsDataURL(blob);

  let res;

  reader.onload = () => {
    res = reader.result;
  };

  return res;
}

/**
 *
 * @returns
 */
export function ls() {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
