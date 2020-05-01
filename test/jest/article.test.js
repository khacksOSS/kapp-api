const app = require('../../server/server')
const articleModel = require('../../server/models/article')

const mongoose = require('mongoose');
const dbHandler = require('./db-handler');

const articleData = {
  "title": "learning test",
  "description": "writing test is always good",
  "author": "abc",
  "tags": "hello"
}

// Connect to a new database before running any tests.
beforeAll(async () => {
  await dbHandler.connect()}
  );

// Remove and close the db and server.
afterAll(async () => await dbHandler.closeDatabase());

afterEach(() => app.close());

describe('Article Model Test', () => {

  it('create & save article successfully', async done => {
      const validArticle = new articleModel(articleData);
      const savedArticle = await validArticle.save();
      
      // Object Id should be defined when successfully saved to MongoDB.
      expect(savedArticle._id).toBeDefined();
      expect(savedArticle.title).toBe(articleData.title);
      expect(savedArticle.description).toBe(articleData.description);
      expect(savedArticle.author).toBe(articleData.author);
      expect(savedArticle.tags).toHaveLength(1);
      expect(Object.keys(savedArticle).length).toBe(6);
      done();
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert article successfully, but the field that isn\'t defined in schema should be undefined', async done => {
      const artileWithInvalidField = new articleModel({
        "title": "learning test",
        "description": "writing test is always good",
        "author": "abc",
        "tags": "hello",
        "nickNameAuthor": "cba"
      });
      const savedArticleWithInvalidField = await artileWithInvalidField.save();
      expect(savedArticleWithInvalidField._id).toBeDefined();
      expect(savedArticleWithInvalidField.nickNameAuthor).toBeUndefined();
      expect(Object.keys(savedArticleWithInvalidField).length).toBe(6);
      done();
  });

  // You shouldn't be able to save any article that hasn't all required data
  it('create article without required field should be failed', async done => {
      const articleWithoutRequiredField = new articleModel({
        "title": "learning test",
        "description": "writing test is always good",
        "author": "abc",
      });
      try {
          const savedArticleWithoutRequiredField = await articleWithoutRequiredField.save();
          error = savedArticleWithoutRequiredField;
      } catch (error) {
          expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(error.errors.tags).toBeDefined();
      }
      done();
  });
  
})