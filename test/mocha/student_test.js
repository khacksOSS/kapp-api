process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Student = require('../../server/models/student')

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let { server }= require('../../server/server');
console.log("server is ",server);
let should = chai.should();

chai.use(chaiHttp);

// Student signup and login data
let studentLoginDetails = {
    regId: 'URK17CS409',
    macAddress: 'khacks9'
};

let studentVerifyDetails = {
    regId: 'URK17CS409'
};

let studentSignUpDetails = { 
    name: 'I',
    regId: 'URK17CS409',
    macAddress: 'khacks9',
    groups: ['ncc', 'CS202']
};

let token

// Create an account, login with details, and check if token comes
describe('Student test suit', () => {
    before(done => {
        //Before each test we empty the database
        Student.deleteMany({}, err => {
            done();
        });
    });

    describe('/POST student', () => {

        // Register student
        it('it should signup', done => {
            chai
                .request(server)
                .post('/students/signup')
                .send(studentSignUpDetails)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('New Account Created');
                    done();
                });
        });

        // login student without verification
        it('it shouldn\'t login', done => {
            chai
                .request(server)
                .post('/students/login')
                .send(studentLoginDetails)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql('Kindly Register first or verify kmail');
                    done();
                });
        })

        // verify
        it('it should verify', done => {
            chai
                .request(server)
                .get('/students/verification')
                .send(studentVerifyDetails)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Verified');
                    done();
                });
        })

        // student login
        it('it should login', done => {
            chai
                .request(server)
                .post('/students/login')
                .send(studentLoginDetails)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Auth successful');
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                });
        })
    });
    
    // follow up with requesting user protected page
    describe('/GET student', () => {
        it('it should check token', done => {
            chai
                .request(server)
                .get('/students/details')
                // we set the auth header with our token
                .set({'Authorization': `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('confirmation').eql('success');
                    res.body.data.should.be.an('Array');
                    done();
                });
        });
    });
});
