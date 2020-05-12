const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Article:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - author
 *          - tags
 *        properties:
 *          title:
 *            type: string
 *            description: Title of the article
 *          description:
 *            type: string
 *            description: Description of the Article.
 *          author:
 *            type: string
 *            description: Author of the Article
 *          Tags:
 *            type : [string]
 *            description : tags associated witht the Article
 *        example:
 *           title: Books
 *           description: None
 *           author: jeffin
 *           tags: [new, old]
 */
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Article', articleSchema);
