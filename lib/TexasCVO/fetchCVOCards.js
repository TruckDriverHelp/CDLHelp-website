async function fetchCVOCards(locale) {
  try {
    const strapiHost = process.env.STRAPI_HOST;
    const strapiPort = process.env.STRAPI_PORT;
    const strapiApiKey = process.env.STRAPI_API_KEY;

    if (!strapiHost || !strapiPort || !strapiApiKey) {
      return [];
    }

    const url = `http://${strapiHost}:${strapiPort}/api/texas-cvo-cards-block?locale=${locale}&populate=*`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${strapiApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const cards = json?.data?.cvo_cards || [];
    const result = cards.map(card => ({
      questionEn: card.QuestionEN,
      answerEn: card.AnswerEN,
      questionLang: card.QuestionLANG,
      answerLang: card.AnswerLANG,
    }));

    return result;
  } catch (error) {
    console.error('Error fetching CVO cards:', error);
    return [];
  }
}

export default fetchCVOCards;
