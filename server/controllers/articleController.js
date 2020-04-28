const Article = require('../models/article');

module.exports = {
  addArticle: async (req, res) => {
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
  },
  getArticles: async (req, res) => {
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
          $lte: new Date(req.query.toDate || Date.now),
        };
      }

      let sortOptions = {};
      sortOptions[req.query.sortBy || 'time'] =
        req.query.orderBy === 'asc' ? 1 : -1;

      if (!req.query.metaOnly) {
        const articles = await Article.find(searchOptions)
          .sort(sortOptions)
          .limit(parseInt(req.query.limit));

        message.articles = articles;
      }
      if (req.query.metaOnly) {
        req.query.metaTags = req.query.metaTags || req.query.metaOnly;
        req.query.metaAuthors = req.query.metaAuthors || req.query.metaOnly;
      }
      if (req.query.metaTags) {
        message.tags = await Article.distinct('tags', searchOptions);
      }
      if (req.query.metaAuthors) {
        message.authors = await Article.distinct('author', searchOptions);
      }

      res.status(201).json({ message: message });
    } catch (err) {
      //500 for any internal error i.e my fault
      res.status(500).json({ message: err.message });
    }
  },
  deleteArticleById: async (req, res) => {
    try {
      const deleteMessage = await Article.deleteOne({
        _id: req.params.articleID,
      });
      res.status(201).json({ message: deleteMessage });
    } catch (err) {
      res.status(401).json({ message: err });
    }
  },
};
