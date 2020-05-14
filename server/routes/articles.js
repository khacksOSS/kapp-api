/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article managment
 */

const express = require('express');
const checkAuth = require('../middlerware/check_auth');
const checkAccess = require('../middlerware/check_access');
const router = express.Router();

const {
  addArticle,
  getArticles,
  getArticleById,
  patchArticleById,
  deleteArticleById,
} = require('../controllers/articleController');

/**
 * @swagger
 * path:
 *  /artciles/:
 *    post:
 *      summary: Create a new article
 *      tags: [Articles]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Article'
 *      responses:
 *        "200":
 *          description: A artcile schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Article'
 */
router.post('/', addArticle);

//get all articles
router.get('/', checkAuth, checkAccess, getArticles);

//get a single article by id
router.get('/:articleID', checkAuth, checkAccess, getArticleById);

//patch one article by ID
router.patch('/:articleID', patchArticleById);

//delete one article by ID
router.delete('/:articleID', deleteArticleById);

module.exports = router;
