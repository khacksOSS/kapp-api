const mongoose = require('mongoose');
const request = require('supertest')
const app = require('../server')

const dbHandler = require('./db-handler');
const articleService = require('../routes/articles');
const Article = require('../models/article')

// Connect to a new in-memory database before running any tests.
beforeAll(async () => await dbHandler.connect());

// Clear all test data after every test.
afterEach(async () => await dbHandler.clearDatabase());

// Remove and close the db and server.
afterAll(async () => await dbHandler.closeDatabase());

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/articles/')
        .send({
            title: 'iPhone 11',
            description: 'A new dual‑camera system captures more of what you see and love. ',
            author: 'Sachin',
            tags: 'mobile'
        })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('title')
    })

    test('should get a post', async () => {
        const res = await request(app)
        .get('/articles/')
        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual([])
    })
})

/*
// Article test suite.
describe('product ', () => {

    // Tests that a valid product can be created through the article without throwing any errors.
    it('can be created correctly', async () => {
        expect(async () => await articleService.create(articleComplete))
            .not
            .toThrow();
    });
});

// Complete product example.
const articleComplete = {
    title: 'iPhone 11',
    description: 'A new dual‑camera system captures more of what you see and love. ',
    author: 'Sachin',
    tags: 'mobile'
    
};
*/