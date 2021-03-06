process.env.NODE_ENV !== 'production' && require('dotenv').config();

const express = require('express');
const os = require('os');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
var pjson = require('../package.json');
const cors = require('cors');

(async () => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV !== 'test'
        ? process.env.DATABASE_URL
        : process.env.TEST_DATABASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Connected to database');
  } catch (error) {
    console.log('Failed to connect to database', error);
  }
})();

const app = express();

app.use(express.json());
app.use(cors());

const articleRoute = require('./routes/articles');
app.use('/articles', articleRoute);

const studentRoute = require('./routes/students');
app.use('/students', studentRoute);

const permissionRoute = require('./routes/permissions');
app.use('/permissions', permissionRoute);

const server = app.listen(process.env.PORT || 2500, () => {
  const host = os.hostname();
  console.log('Server Started at ', host, ':', server.address().port);
});

const options = {
  definition: {
    components: {},
    openapi: '3.0.0',
    info: {
      title: pjson.name,
      version: pjson.version,
    },
  },
  // Path to the API docs
  apis: [
    path.resolve(__dirname, 'models/*.js'),
    path.resolve(__dirname, 'routes/*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  console.log('dir name is ', __dirname);
  res.sendFile(path.join(__dirname, 'redoc.html'));
});

module.exports = {
  server,
  swaggerSpec,
};
