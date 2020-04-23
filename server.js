if(process.env.NODE_ENV !== 'production' )
    require("dotenv").config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.log("Error from database"))
db.once('open', () => console.log("Connected to database") )

app.use(express.json())

const articleRoute = require("./routes/articles")
app.use('/articles', articleRoute)

app.listen(process.env.PORT || 3000, () => console.log('Server Started') )