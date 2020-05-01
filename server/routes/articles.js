const express = require('express');
const router = express.Router();
const {
  addArticle,
  getArticles,
  getArticleById,
  patchArticleById,
  deleteArticleById,
} = require('../controllers/articleController');

//put 1 or multiple article
router.post('/', addArticle);
//get all articles
router.get('/', getArticles);
//get a single article by id
router.get('/:articleID', getArticleById);
//patch one article by ID
router.patch('/:articleID', patchArticleById)
//delete one article by ID
router.delete('/:articleID', deleteArticleById);

module.exports = router;
