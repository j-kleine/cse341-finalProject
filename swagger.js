const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'Event Management API',
        description: 'CSE341 Final Project, API for managing events with users, participants and comments.'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

// this will generate swagger.json
swaggerAutogen(outputFile, endpointFiles, doc);