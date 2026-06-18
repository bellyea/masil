export async function fetchEvent(id: string) {
  const res = await fetch(`/api/events/${id}`);
  return res.json();
}