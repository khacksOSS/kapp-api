if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const app = express();
const os = require('os');
const mongoose = require('mongoose');
var cors = require('cors')

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} else {
    mongoose.connect(process.env.TEST_DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const db = mongoose.connection;
db.on('error', error => console.log('Error from database', error));
db.once('open', () => console.log('Connected to database'));

//app.use(cors())
app.use(express.json());


const articleRoute = require('./routes/articles');
app.use('/articles', articleRoute);

const server = app.listen(process.env.PORT || 2500, () => {
    const host = os.hostname();
    console.log('Server Started at ', host, ':', server.address().port);
});

module.exports = server;