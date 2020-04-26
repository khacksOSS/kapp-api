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
                  res.body.should.have.property('message').be.a('array');
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
                  res.body.message[0].should.have.property('author').eql('justin');
                  res.body.message[0].should.have.property('_id');
                  res.body.message[0].should.have.property('time');
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
                  res.body.should.have.property('message').be.a('array');
                  res.body.message.length.should.be.eql(1);
                  res.body.message[0].should.be.a('object');
                  res.body.message[0].should.have.property('author').eql('justin');
                  res.body.message[0].should.have.property('title').eql('learning test');
                  res.body.message[0].should.have.property('time');            
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
                res.body.message.length.should.be.eql(2);
            done();
          });
    });

  });

// Testing param
describe('/GET articles with param ', () => {
  it('it should GET all the articles with specific author name', (done) => {
    chai.request(server)
        .get('/articles?author=justin')
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('array');
              res.body.message.length.should.be.eql(1);
          done();
        });
  });

  it('it should GET all the articles with similar title', (done) => {
    chai.request(server)
        .get('/articles?title=learning')
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('array');
              res.body.message.length.should.be.eql(2);
          done();
        });
  });

  it('it should GET all the articles sorted by author', (done) => {
    let arr = [];
    chai.request(server)
        .get('/articles?sortBy=author')
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('array');
              arr = res.body.message;
              

        });
        chai.request(server)
        .get('/articles')
        .end((err, res) => {
            res.body.message.sort(compare_author).should.be.eql(arr);
        });   
        done();
  });


  it('it should GET all the articles sorted by time in ascending', (done) => {
    let arr = [];
    chai.request(server)
        .get('/articles?orderBy=asc')
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('array');
              arr = res.body.message;
              

        });
        
        chai.request(server)
        .get('/articles')
        .end((err, res) => {
          console.log("ARR IS",arr);
            console.log('resp is ',res.body.message.sort(compare_time))
            res.body.message.sort(compare_time).should.be.eql(arr);
        });   
        done();
  });

  it('it should GET 2 articles with limit param', (done) => {
    chai.request(server)
        .get('/articles?limit=2')
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('array');
              res.body.message.length.should.be.eql(2);
          done();
        });
  });
});

describe('/DELETE article with particular id ', () => {
  it('it should delete a article with particular id', async (done) => {
    let path;
    res = await chai.request(server)
    .get('/articles?author=justin').end((err,res) => {return res});
    // .end((err, res) => {
    //       res.should.have.status(201);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('message');
    //       res.body.should.have.property('message').be.a('array');
    //       path = `/articles/${res.body.message[0]._id}`
    //     console.log("the object is ",typeof(path), "and ", path);
    // });
    console.log("BEFORE ", res.body)
    console.log("DOES IT WORK ?",path);
    chai.request(server)
        .delete(path)
        .end((err, res) => {
              console.log("NOW THE PATH IS ",path)
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('object');
              res.body.message.ok.should.be.eql(1);
          done();
        });
  });

  it('it should have 2 articles left ', (done) => {
    chai.request(server)
        .get('/articles')
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('array');
              res.body.message.length.should.be.eql(2);         
          done();
        });
  });

  it('it should error for a article without particular id', (done) => {
    chai.request(server)
        .delete('/articles/5ea5dc9e92a6a52cc245389e')
        .end((err, res) => {
          //console.log("Erro r",err);
          //console.log("Respo",res);
              // res.should.have.status(401);
          done();
        });
  });
});


});
