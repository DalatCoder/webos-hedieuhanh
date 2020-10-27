function convertSize(byte) {
  if (byte < 1024) return `${byte} B`;

  const kbyte = Math.round(byte / 1024);
  if (kbyte < 1024) return `${kbyte} KB`;

  const mbyte = Math.round(kbyte / 1024);
  if (mbyte < 1024) return `${mbyte} MB`;

  const gbyte = Math.round(mbyte / 1024);
  if (gbyte < 1024) return `${gbyte} GB`;

  const tbyte = Math.round(gbyte / 1024);
  return `${tbyte} TB`;
}

export default convertSize;
