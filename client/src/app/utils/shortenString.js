export default function shortenString(rawString) {
  if (rawString.length < 30) return rawString;
  const chars = rawString.split('').slice(0, 40).join('');
  return `${chars} ...`;
}
