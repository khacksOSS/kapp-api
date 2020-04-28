const express = require('express');
const router = express.Router();
const {
  addArticle,
  getArticles,
  deleteArticleById,
} = require('../controllers/articleController');

//put 1 or multiple article
router.post('/', addArticle);
//get all articles
router.get('/', getArticles);

//delete one article
router.delete('/:articleID', deleteArticleById);

module.exports = router;
