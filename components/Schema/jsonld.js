import Head from 'next/head';

const JsonLd = ({ jsonld }) => (
  <Head>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  </Head>
);

export default JsonLd;
