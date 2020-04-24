const app = require('../server')

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
    
    it('should create a new post', async done => {
      const res = await request
        .post('/articles/')
        .send({
            title: 'iPhone 11',
            description: 'A new dual‑camera system captures more of what you see and love. ',
            author: 'Sachin',
            tags: 'mobile'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title');
      done();
    })

    it('should get a post which is posted in pervious test', async done => {
        const res = await request
        .get('/articles/');
        expect(res.statusCode).toEqual(201);
        expect(res.body[0].author).toEqual('Sachin');
        done();
    })
})
