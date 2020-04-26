process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Article = require('../models/article');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('articles', () => {
    before((done) => { //Before each test we empty the database
        Article.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/GET articles', () => {
      it('it should GET all the articles', (done) => {
        chai.request(server)
            .get('/articles')
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                  res.body.should.have.property('message.articles').be.a('array');
                  res.body.message.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST ', () => {
      it('it should POST a article ', (done) => {
          let data = { "data":[
            {
              title : 'learning test',
              description :  'writing test is always good',
              author : 'justin',
              tags :  'hello'
            }
          ]
          };
        chai.request(server)
            .post('/articles')
            .send(data)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                  res.body.message.articles[0].should.have.property('author').eql('justin');
                  res.body.message.articles[0].should.have.property('_id');
                  res.body.message.articles[0].should.have.property('time');
              done();
            });
      });

      it('it should fail to POST a article without title', (done) => {
        let article = [{
          description :  'writing test is always good',
          author : 'justin',
          tags :  'hello'
        }]
      chai.request(server)
          .post('/articles')
          .send(article)
          .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
            done();
          });
      });

      it('it should GET recent insert articles', (done) => {
        chai.request(server)
            .get('/articles')
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                  res.body.should.have.property('message.articles').be.a('array');
                  res.body.message.articles.length.should.be.eql(1);
                  res.body.message.articles.[0].should.be.a('object');
                  res.body.message.articles.[0].should.have.property('author').eql('justin');
                  res.body.message.articles.[0].should.have.property('title').eql('learning test');
                  res.body.message.articles.[0].should.have.property('time');            
              done();
            });
      });

      it('it should POST multiple article ', (done) => {
        let data = {"data":[{ 
          title : 'learning test',
          description :  'writing test is always good',
          author : 'justin',
          tags :  'hello'
        },
        {
        title : 'coming first in cp',
        description :  'I will do',
        author : 'justin',
        tags :  'programming'
      },
      ]};
      chai.request(server)
          .post('/articles')
          .send(data)
          .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.articles.length.should.be.eql(2);
            done();
          });
    });

  });

});
