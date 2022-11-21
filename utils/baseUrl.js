const baseUrl = process.env.NODE_ENV === "production" 
? 'https://texap-react.www.truckdriver.help' 
: 'http://localhost:3000';

export default baseUrl;