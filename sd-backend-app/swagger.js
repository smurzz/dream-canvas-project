const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
    './app/routes/authRoutes.js', 
    './app/routes/imageRoutes.js', 
    './app/routes/modelRoutes.js', 
    './app/routes/userRoutes.js'
];

swaggerAutogen(outputFile, endpointsFiles);