const express = require('express');
const router = express.Router();
const Article = require('../models/article');

//put 1 article
router.post('/', async (req, res) => {
  const article = new Article({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    tags: req.body.tags,
  });
  try {
    const newArticle = await article.save();
    //201 cause its sucess
    res.status(201).json(newArticle);
  } catch (arr) {
    res.status(400).json({ message: err.message });
  }
});

//get all articles
router.get('/', async (req, res) => {
  try {
    //todo--> add more serch and filter options
    const articles = await Article.find();

    //since for now there is no search option
    //our req is always sucess so 201
    res.status(201).json(articles);
  } catch (err) {
    //500 for any internal error i.e my fault
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
