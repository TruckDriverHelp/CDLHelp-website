const baseUrl = process.env.NODE_ENV === "production" 
? 'https://cdlhelp.com' 
: 'http://localhost:3000';

export default baseUrl;