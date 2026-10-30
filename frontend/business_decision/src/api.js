const API_BASE = 'http://localhost:8000';

export async function predictSingle(moduleKey, data) {
  const res = await fetch(`${API_BASE}/predict-single/${moduleKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });

  const body = await res.json();

  if (!res.ok || body.error) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return body;
}
