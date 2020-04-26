if(process.env.NODE_ENV !== 'production' )
    require("dotenv").config()

const express = require('express')
const app = express()
const os = require('os')
const mongoose = require('mongoose')

if(process.env.NODE_ENV !== 'test')
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true})
else
    mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true})
    
const db = mongoose.connection
db.on('error', (error) => console.log("Error from database"))
db.once('open', () => console.log("Connected to database") )

app.use(express.json())

const articleRoute = require("./routes/articles")
app.use('/articles', articleRoute)

server = app.listen(process.env.PORT || 3000, () => {
    const host = os.hostname();
    console.log('Server Started at ', host,':',server.address().port); }
    )

module.exports = server