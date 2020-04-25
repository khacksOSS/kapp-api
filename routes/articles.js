const express = require("express")
const router = express.Router()
const Article = require('../models/article')

//put 1 article
router.post('/', async (req,res) => {

    const article = new Article({
        title : req.body.title,
        description :  req.body.description,
        author : req.body.author,
        tags :  req.body.tags,
        time : req.body.time
    })
    try {
        const newArticle = await article.save()
        //201 cause its sucess
        res.status(201).json( { message : newArticle} )
    } catch(err) {
        //client's mistake
        res.status(401).json( { message : err.message })
    }
})


//get all articles
router.get('/' , async (req,res) => {
    try {
        //todo--> add article limits
        let searchOptions = {}
        if( req.query.title ) {
            searchOptions.title = new RegExp(req.query.title, 'i')
        }
        if( req.query.author ) {
            searchOptions.author = new RegExp(req.query.author, 'i')
        }

        //we can have some default values of these as well
        if( req.query.fromDate ) {
            searchOptions.time = {
                $gte: new Date(req.query.fromDate), 
                $lte: new Date( req.query.toDate || Date.now )
            } 
        }
              
        let sortOptions = {}
        sortOptions[ req.query.sortBy || "time" ] = req.query.orderBy === 'asc' ? 1 : -1
        
        const articles = await Article.find(searchOptions).sort(sortOptions)
        
        res.status(201).json( {message : articles} )
    } catch(err) {
        //500 for any internal error i.e my fault
        res.status(500).json({ message: err.message })
    }
})

module.exports = router