const Article = require('../models/article');

/**
 * @swagger
 *  components:
 *    schemas:
 *      AddArticle:
 *        type: object
 *        properties:
 *          message:
 *            type: array
 *            description: Array of articles posted
 *        example:
 *           message: [{
 *              title: Books,
 *              description: None,
 *              author: jeffin,
 *              tags: [new, old]
 *                    }]
 *      Error:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: Error client made a mistake
 *        example:
 *           message: Error message
 */

const addArticle = async (req, res) => {
  try {
    const data = req.body.data;
    let newArticle = [];
    for (const [, value] of Object.entries(data)) {
      const article = new Article({
        title: value.title,
        description: value.description,
        author: value.author,
        tags: value.tags,
        time: value.time,
      });
      newArticle.push(await article.save());
    }
    //201 cause its sucess
    res.status(201).json({ message: newArticle });
  } catch (err) {
    //client's mistake
    res.status(401).json({ message: err.message });
  }
};

/**
 * @swagger
 *  components:
 *    schemas:
 *      GetArticle:
 *        type: object
 *        properties:
 *          message:
 *            type: array
 *            description: Array of articles
 *        example:
 *           message: [{
 *              title: Books,
 *              description: None,
 *              author: jeffin,
 *              tags: [new, old]
 *                    },]
 */

const getArticles = async (req, res) => {
  try {
    let message = {};
    let searchOptions = {};

    if (req.query.title) {
      searchOptions.title =
        req.query.noRegxTitle || req.query.noRegxAll
          ? req.query.title
          : new RegExp(req.query.title, 'i');
    }
    if (req.query.author) {
      searchOptions.author =
        req.query.noRegxAuthor || req.query.noRegxAll
          ? req.query.author
          : new RegExp(req.query.author, 'i');
    }
    if (req.query.tags) {
      if (typeof req.query.tags === 'string') {
        searchOptions.tags =
          req.query.noRegxTags || req.query.noRegxAll
            ? req.query.tags
            : new RegExp(req.query.tags, 'i');
      } else {
        let searchTags = [];
        if (req.query.noRegxTags || req.query.noRegxAll) {
          req.query.tags.forEach(tag => {
            searchTags.push(tag);
          });
        } else {
          req.query.tags.forEach(tag => {
            searchTags.push(new RegExp(tag, 'i'));
          });
        }
        searchOptions.tags = { $all: searchTags };
      }
    }

    if (req.query.fromDate) {
      searchOptions.time = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate || Date.now()),
      };
    }

    let sortOptions = {};
    sortOptions[req.query.sortBy || 'time'] =
      req.query.orderBy === 'asc' ? 1 : -1;

    if (!(req.query.metaOnly || req.query.noArticle)) {
      const articles = await Article.find(searchOptions)
        .sort(sortOptions)
        .limit(parseInt(req.query.limit));

      message.articles = articles;
    }
    if (req.query.metaTags || req.query.metaOnly) {
      message.tags = await Article.distinct('tags', searchOptions);
    }
    if (req.query.metaAuthors || req.query.metaOnly) {
      message.authors = await Article.distinct('author', searchOptions);
    }

    res.status(201).json({ message: message });
  } catch (err) {
    //500 for any internal error i.e my fault
    res.status(500).json({ message: err.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.articleID });
    res.status(201).json({ message: article });
  } catch (err) {
    //wrong id by user
    res.status(401).json({ message: err.message });
  }
};

const deleteArticleById = async (req, res) => {
  try {
    const deleteMessage = await Article.deleteOne({
      _id: req.params.articleID,
    });
    res.status(201).json({ message: deleteMessage });
  } catch (err) {
    res.status(401).json({ message: err });
  }
};

const patchArticleById = async (req, res) => {
  try {
    const updateMessage = await Article.updateOne(
      { _id: req.params.articleID },
      { $set: req.body }
    );
    res.status(201).json({ message: updateMessage });
  } catch (err) {
    res.status(401).json({ message: err });
  }
};

module.exports = {
  getArticles,
  deleteArticleById,
  addArticle,
  patchArticleById,
  getArticleById,
};
