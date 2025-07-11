export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query, lat, lng } = req.query;

  if (!query || !lat || !lng) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=50000&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching places data' });
  }
}
