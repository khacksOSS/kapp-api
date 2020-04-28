const app = require('../../server/server')

const supertest = require('supertest')
const request = supertest(app)

const dbHandler = require('./db-handler');

// Connect to a new database before running any tests.
beforeAll(async () => {
  await dbHandler.connect()}
  );

// Remove and close the db and server.
afterAll(async () => await dbHandler.closeDatabase());

afterEach(() => app.close());

describe('Article testing', () => {

    it('/POST should create a new post', async done => {
      const res = await request
        .post('/articles/')
        .send({
          "data" : [{
            "title": "learning test",
            "description": "writing test is always good",
            "author": "abc",
            "tags": "hello"
          }]
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message[0]).toHaveProperty('title');
      done();
    })

    it('/GET should get a post which is posted in pervious test', async done => {
        const res = await request
        .get('/articles/');
        expect(res.statusCode).toEqual(201);
        expect(res.body.message.articles[0].author).toEqual('abc');
        done();
    })
})