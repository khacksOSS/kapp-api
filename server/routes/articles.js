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
 *                $ref: '#/components/schemas/AddArticle'
 *        "401":
 *          description: Client mistake Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */

// post article
router.post('/', addArticle);

/**
 * @swagger
 * path:
 *  /artciles/:
 *    get:
 *      security:
 *        - bearerAuth: []
 *          featureAccess: []
 *      summary: Get all article
 *      tags: [Articles]
 *      responses:
 *        "200":
 *          description: A artcile schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AddArticle'
 *        "401":
 *          description: Client mistake Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 */

// get all articles if authentication and permissions passes
router.get('/', checkAuth, checkAccess, getArticles);

// get a single article by id if authentication and permissions passes
router.get('/:articleID', checkAuth, checkAccess, getArticleById);

// patch one article by ID
router.patch('/:articleID', patchArticleById);

// delete one article by ID
router.delete('/:articleID', deleteArticleById);

module.exports = router;
