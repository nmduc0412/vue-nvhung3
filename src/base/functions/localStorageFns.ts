/**
 * Lấy giá trị từ LocalStorage
 * @param key
 * @param prefix
 * @param isPrefix
 * @returns
 */
 export function getLocalStorage(key: string, prefix = "", isPrefix = true) {
    if (!key || key == "") {
      return null;
    }
    const newPrefix = isPrefix && prefix == "" ? getPrefixKey() : "";
    const newKey = isPrefix ? newPrefix + "_" + key : key;
    return localStorage.getItem(newKey);
  }
  
  /**
   * Lấy mặc định prefix gán vào localstorage = hostname
   * @returns
   */
  function getPrefixKey() {
    return location.host;
  }
  
  /**
   * Set giá trị từ LocalStorage
   * @param key
   * @param prefix
   * @param isPrefix
   * @returns
   */
  export function setLocalStorage(
    key: string,
    value: string,
    prefix = "",
    isPrefix = true
  ) {
    if (!key || key == "" || !value) {
      return;
    }
    const newPrefix = isPrefix && prefix == "" ? getPrefixKey() : "";
    const newKey = isPrefix ? newPrefix + "_" + key : key;
    localStorage.setItem(newKey, value);
  }
  
  /**
   * Set giá trị từ LocalStorage
   * @param key
   * @param prefix
   * @param isPrefix
   * @returns
   */
  export function removeLocalStorage(key: string, prefix = "", isPrefix = true) {
    if (!key || key == "") {
      return;
    }
    const newPrefix = isPrefix && prefix == "" ? getPrefixKey() : "";
    const newKey = isPrefix ? newPrefix + "_" + key : key;
    localStorage.removeItem(newKey);
  }
  