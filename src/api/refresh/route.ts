export async function POST() {
  const response = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  return Response.json({ data });
}
