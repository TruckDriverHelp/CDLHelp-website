async function fetchArticles(locale) {
  const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?locale=${locale}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {}
}

export default fetchArticles;
