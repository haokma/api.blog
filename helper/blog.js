module.exports.smartTrim = (str, length, delim, appendix) => {
  if (str.length < length) return str;

  let trimedStr = str.substr(0, length + delim.length);
  // cat lay chuoi co do dai = length + do dai delim

  let lastDelimIndex = trimedStr.lastIndexOf(delim);
  // tim vi tri xuat hien delim cuoi cung (thuong la khoang trang)

  if (lastDelimIndex >= 0) trimedStr = trimedStr.substr(0, lastDelimIndex);
  // cat lai chuoi den delim (thuong la khoang trang)

  if (trimedStr) trimedStr += appendix;
  // chen them

  return trimedStr;
};
