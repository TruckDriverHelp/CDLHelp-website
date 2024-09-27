function WebPageSchema({ name, description, url }) {
  
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name,
      description,
      url
    };
  
    return (
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    );
  }
  
  export default WebPageSchema;