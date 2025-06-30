// This file handles all /en/* URLs and redirects them to the correct path without /en/ prefix
export default function EnglishRedirect() {
  return null;
}

export async function getServerSideProps({ params, res }) {
  const slug = params.slug ? params.slug.join('/') : '';
  const destination = `/${slug}`;
  
  // Set proper redirect headers
  res.setHeader('Location', destination);
  res.statusCode = 301;
  res.end();
  
  return {
    props: {},
  };
}