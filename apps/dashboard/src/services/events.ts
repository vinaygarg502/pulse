export const getEventsData = async () => {
  const response = await fetch('http://localhost:3000/events');
  const events = await response.json();
  return events.data;
};
