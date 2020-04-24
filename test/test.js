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
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST ', () => {
      it('it should POST a article ', (done) => {
          let article = {
            title : 'learning test',
            description :  'writing test is always good',
            author : 'justin',
            tags :  'hello'
          }
        chai.request(server)
            .post('/articles')
            .send(article)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('author').eql('justin');
                  res.body.should.have.property('_id');
                  res.body.should.have.property('time');
              done();
            });
      });

      it('it should fail to POST a article without title', (done) => {
        let article = {
          description :  'writing test is always good',
          author : 'justin',
          tags :  'hello'
        }
      chai.request(server)
          .post('/articles')
          .send(article)
          .end((err, res) => {
                res.should.have.status(400);
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
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                  res.body[0].should.be.a('object');
                  res.body[0].should.have.property('author').eql('justin');
                  res.body[0].should.have.property('title').eql('learning test');
                  res.body[0].should.have.property('time');            
              done();
            });
      });
  });

});
