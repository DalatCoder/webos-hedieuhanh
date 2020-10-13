export default function shortenString(rawString) {
  if (rawString.length < 40) return rawString;
  const chars = rawString.split('').slice(0, 40).join('');
  return `${chars} ...`;
}
