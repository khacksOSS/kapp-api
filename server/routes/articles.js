/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article managment
 */

const express = require('express');
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



router.get('/', getArticles);


router.get('/:articleID', getArticleById);

router.patch('/:articleID', patchArticleById);


router.delete('/:articleID', deleteArticleById);

module.exports = router;
