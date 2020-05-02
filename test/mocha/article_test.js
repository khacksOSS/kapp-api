process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Article = require('../../server/models/article');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server/server');
let should = chai.should();

// Comparing based on the property author
function compare_author(a, b) {
  // a should come before b in the sorted order
  if (a.author < b.author) {
    return 1;
    // a should come after b in the sorted order
  } else if (a.author > b.author) {
    return -1;
    // and and b are the same
  } else {
    return 0;
  }
}

// Comparing based on the property time
function compare_time(a, b) {
  // a should come before b in the sorted order
  if (a.time < b.time) {
    return -1;
    // a should come after b in the sorted order
  } else if (a.time > b.time) {
    return 1;
    // and and b are the same
  } else {
    return 0;
  }
}

chai.use(chaiHttp);
//Our parent block
describe('articles', () => {
  before(done => {
    //Before each test we empty the database
    Article.deleteMany({}, err => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe('/GET articles', () => {
    it('it should GET all the articles', done => {
      chai
        .request(server)
        .get('/articles')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          res.body.message.articles.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe('/POST ', () => {
    it('it should POST a article ', done => {
      let data = {
        data: [
          {
            title: 'learning test',
            description: 'writing test is always good',
            author: 'abc',
            tags: 'hello',
          },
        ],
      };
      chai
        .request(server)
        .post('/articles')
        .send(data)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message[0].should.have.property('author').eql('abc');
          res.body.message[0].should.have.property('_id');
          res.body.message[0].should.have.property('time');
          done();
        });
    });

    it('it should fail to POST a article without title', done => {
      let article = [
        {
          description: 'writing test is always good',
          author: 'justin',
          tags: 'hello',
        },
      ];
      chai
        .request(server)
        .post('/articles')
        .send(article)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });

    it('it should GET recent insert articles', done => {
      chai
        .request(server)
        .get('/articles')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          res.body.message.articles.length.should.be.eql(1);
          res.body.message.articles[0].should.be.a('object');
          res.body.message.articles[0].should.have
            .property('author')
            .eql('abc');
          res.body.message.articles[0].should.have
            .property('title')
            .eql('learning test');
          res.body.message.articles[0].should.have.property('time');
          done();
        });
    });

    it('it should POST multiple article ', done => {
      let data = {
        data: [
          {
            title: 'learning test',
            description: 'writing test is always good',
            author: 'justin',
            tags: 'hello',
          },
          {
            title: 'coming first in cp',
            description: 'I will do',
            author: 'def',
            tags: 'programming',
          },
        ],
      };
      chai
        .request(server)
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
    it('it should GET all the articles with specific author name', done => {
      chai
        .request(server)
        .get('/articles?author=justin')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          res.body.message.articles.length.should.be.eql(1);
          done();
        });
    });

    it('it should GET all the articles with similar title', done => {
      chai
        .request(server)
        .get('/articles?title=learning')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          res.body.message.articles.length.should.be.eql(2);
          done();
        });
    });

    it('it should GET all the articles sorted by author', done => {
      let arr = [];
      chai
        .request(server)
        .get('/articles?sortBy=author')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          arr = res.body.message.articles;
        });
      chai
        .request(server)
        .get('/articles')
        .end((err, res) => {
          res.body.message.articles.sort(compare_author).should.be.eql(arr);
        });
      done();
    });

    it('it should GET all the articles sorted by time in ascending', done => {
      let arr = [];
      chai
        .request(server)
        .get('/articles?orderBy=asc')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          arr = res.body.message.articles;
        });
      chai
        .request(server)
        .get('/articles')
        .end((err, res) => {
          // console.log('resp is ',res.body.message.sort(compare_time))
          res.body.message.articles.sort(compare_time).should.be.eql(arr);
        });
      done();
    });

    it('it should GET 2 articles with limit param', done => {
      chai
        .request(server)
        .get('/articles?limit=2')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          res.body.message.articles.length.should.be.eql(2);
          done();
        });
    });
  });
  //.then((err,res) => {return res});
  
  //testing the GET by ID
  describe('/GET article with particular id ', () => {
    it('it should get a article with particular id', done => {
      let path;
      // res = await
      chai
        .request(server)
        .get('/articles?author=justin')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          path = `/articles/${res.body.message.articles[0]._id}`;
          return chai
            .request(server)
            .get(path)
            .then(res => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('object');
              res.body.message.should.have.property('title').eql("learning test");
              res.body.message.should.have.property('description').eql("writing test is always good");
              res.body.message.should.have.property('author').eql("justin");
            });
        });
      done();
    });

    it('it should ignore geting a article without particular id', done => {
      chai
        .request(server)
        .get('/articles/notPossibleID')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').be.not.a('object');
          res.body.should.have.property('message').be.a('string');
          done();
        });
    });
  });
  
  
  describe('/DELETE article with particular id ', () => {
    it('it should delete a article with particular id', async done => {
      let path;
      // res = await
      chai
        .request(server)
        .get('/articles?author=justin')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('articles').be.a('array');
          path = `/articles/${res.body.message.articles[0]._id}`;
          return chai
            .request(server)
            .delete(path)
            .then(res => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('message').be.a('object');
              res.body.message.ok.should.be.eql(1);
              res.body.message.deletedCount.should.be.eql(1);
              res.body.message.n.should.be.eql(1);
            });
        });
      done();
    });

    it('it should have 2 articles left ', done => {
      setTimeout(() => {
        chai
          .request(server)
          .get('/articles')
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.have.property('articles').be.a('array');
            res.body.message.articles.length.should.be.eql(2);
            done();
          });
      }, 200);
    });

    it('it should ignore deleting a article without particular id', done => {
      chai
        .request(server)
        .delete('/articles/5ea5dc9e92a6a52cc245389e')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').be.a('object');
          res.body.message.ok.should.be.eql(1);
          res.body.message.deletedCount.should.be.eql(0);
          res.body.message.n.should.be.eql(0);
          done();
        });
    });
  });

  describe('/GET articles with meta param', () => {
    it('it should GET all the articles with not articles property', done => {
      chai
        .request(server)
        .get('/articles?metaOnly=true')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.have.property('tags');
          res.body.message.should.have.property('authors');
          chai.expect(res.body.message).to.not.have.property('articles');
          done();
        });
    });
  });

  describe('/PATCH articles with ID', () => {

    let id = undefined;
    it('it should patch a added article', done => {
      //we'll first insert the article

      //we ll add this initially
      let beforeArticle = {
        data : [ 
          {
            title: 'not yet updated',
            description: 'writing test is always good',
            author: 'sasta',
            tags: [ "hello" ,"deletedata" ],
          }
        ]
      };
      //the article obj to update
      let afterArticle = {
        title: 'i was updated' ,
        description: 'writing test is always good',
        author: 'sasta_achar'
      };

      //first we'll insert a article 
      chai
        .request(server)
        .post('/articles')
        .send(beforeArticle)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message[0].should.have.property('title').eql('not yet updated');
          res.body.message[0].should.have.property('author').eql('sasta');
          res.body.message[0].should.have.property('_id');
          res.body.message[0].should.have.property('time');
          id = res.body.message[0]._id;

          //now we check the article update status
          return  chai
          .request(server)
          .patch(`/articles/${id}`)
          .send(afterArticle)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.have.property('n').eql(1);
            res.body.message.should.have.property('nModified').eql(1);
            res.body.message.should.have.property('ok').eql(1);
            done();
          });
        });
    })


    //the values should have changed 
    it('it should change the values', done => {
      chai
      .request(server)
      .get(`/articles/${id}`)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.have.property('title').eql('i was updated');
        res.body.message.should.have.property('author').eql('sasta_achar');
        res.body.message.should.have.property('_id');
        res.body.message.should.have.property('time');
        done();
      });
    });

    //an update to _id is not possible 
    it('it should not update _id', done => {
      let illegalArticle = {
        _id : `newID6969`,
        title: 'this shouldnt happen' ,
        description: 'writing test is always good',
        author: 'sasta_achar'
      };
      chai
      .request(server)
      .patch(`/articles/${id}`)
      .send(illegalArticle)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.have.property('name').eql("CastError");
        done();
      });
    });
  });
});
