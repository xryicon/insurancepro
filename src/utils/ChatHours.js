export function isChatOnline() {
  const now = new Date();

  const madridTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const weekday = madridTime.find(p => p.type === 'weekday')?.value;
  const hour = parseInt(
    madridTime.find(p => p.type === 'hour')?.value,
    10
  );

  const isWeekend = weekday === 'Saturday' || weekday === 'Sunday';

  if (isWeekend) return false;

  return hour >= 9 && hour < 16;
}