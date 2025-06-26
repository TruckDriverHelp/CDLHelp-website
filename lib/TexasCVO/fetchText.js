async function fetchCVOCards(locale) {
    try {
        // Check if environment variables are available
        const strapiHost = process.env.STRAPI_HOST;
        const strapiPort = process.env.STRAPI_PORT;
        const strapiApiKey = process.env.STRAPI_API_KEY;
        
        if (!strapiHost || !strapiPort || !strapiApiKey) {
            console.error('Strapi configuration is missing');
            return null;
        }
        
        const url = `http://${strapiHost}:${strapiPort}/api/texas-cvo-cards-block?locale=${locale}&populate=*`;
        
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${strapiApiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const text = json?.data?.attributes?.Text || null;

        return text;
    }
    catch (error) {
        console.error('Error fetching Texas CVO text:', error.message);
        return null;
    }
}

export default fetchCVOCards;