/**
 * Returns a YYYY-MM-DD date string formatted according to the local device timezone,
 * preventing UTC shift bugs where evening or night logs get recorded under yesterday's/tomorrow's date.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
