export default async function handler(req, res) {
  const target = req.query.url;

  if (!target) {
    res.status(400).json({ error: 'Missing url query parameter ?url=' });
    return;
  }

  try {
    // Fetch the NBA endpoint from the server side (no browser CORS here)
    const response = await fetch(target);

    // Read the response body as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Preserve content-type where possible
    const contentType = response.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);

    // Allow your frontend to access this from the same origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    res.status(response.status).send(buffer);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed', details: String(err) });
  }
}
