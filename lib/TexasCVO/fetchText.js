async function fetchCVOCards(locale) {
    const url = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/texas-cvo-cards-block?locale=${locale}&populate=*`
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${process.env.STRAPI_API_KEY}`
            }
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const text = json.data.attributes.Text;

        return text;
    }
    catch (error) {
        console.error(error.message);
    }

}

export default fetchCVOCards;