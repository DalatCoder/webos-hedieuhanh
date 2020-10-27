export default function shortenString(rawString) {
  if (rawString.length < 35) return rawString;
  const chars = rawString.split('').slice(0, 32).join('');
  return `${chars} ...`;
}
