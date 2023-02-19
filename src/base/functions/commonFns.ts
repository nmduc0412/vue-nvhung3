/**
 * Clone dữ liệu
 * @param data dữ liệu clone
 * @returns
 */
export function cloneData(data: any) {
  if (!data) {
    return null;
  }

  return JSON.parse(JSON.stringify(data));
}

/**
 * Định dạng tiền tệ
 * @param value giá trị cần format
 * @param currency đơn vị tiền tệ
 * @param decimals số sau dấu phẩy
 * @returns 
 */
export function formatCurrency(value: any, currency = "đ", decimals = 2) {
  if (!value) {
    return "0";
  }
  const number = parseInt(value);
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return "0";
  decimals = number == value ? 0 : decimals;
  const stringified = Math.abs(value).toFixed(decimals);
  const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = _int.length % 3;
  const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
  const _float = decimals ? stringified.slice(-1 - decimals) : "";
  const sign = value < 0 ? "-" : "";
  const digitsRE = /(\d{3})(?=\d)/g;
  return (
    sign + head + _int.slice(i).replace(digitsRE, "$1,") + _float + currency
  );
}

/**
 * Định dạng số
 * @param value giá trị cần format
 * @param decimals số sau dấu phẩy
 * @returns 
 */
export function formatNumber(value: any, decimals = 2) {
  if (!value) {
    return "0";
  }
  const number = parseInt(value);
  value = parseFloat(value);
  if (!isFinite(value) || (!value && value !== 0)) return "0";
  decimals = number == value ? 0 : decimals;
  const stringified = Math.abs(value).toFixed(decimals);
  const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = _int.length % 3;
  const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
  const _float = decimals ? stringified.slice(-1 - decimals) : "";
  const sign = value < 0 ? "-" : "";
  const digitsRE = /(\d{3})(?=\d)/g;
  return sign + head + _int.slice(i).replace(digitsRE, "$1,") + _float;
}
