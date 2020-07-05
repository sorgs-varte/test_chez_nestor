let request = require('supertest');
let app = require('../index.js');

describe('GET /test', function() {
    it('respond with ok', function(done) {
        request(app).get('/test').expect('ok', done);
    });
});

describe('POST /login', function () {
    it('respond with 200', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "cheznestor"})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })
});

describe('POST /login', function () {
    it('respond with 401 bad password', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "plop"})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })
});

describe('POST /login', function () {
    it('respond with 401 bad email', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznest.com', password : "dede"})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })
});

describe('POST /login', function () {
    it('respond with 400 empty body', function (done) {
        request(app)
            .post('/login')
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })
});

describe('GET /login', function () {
    it('respond with 404', function (done) {
        request(app)
            .get('/login')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })
});

describe('PUT /client/update', function () {
    it('respond with 200', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "cheznestor"})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);

                request(app)
                    .put('/client/update')
                    .send({email: 'anthony@cheznestor.com', key : "firstname", value:"bob"})
                    .set('Content-Type', 'application/json')
                    .set('Authorization', res.body.token)
                    .expect(200)
                    .end(function(err, res2) {
                    if (err) return done(err);
                    done();
                });
            });
    })
});

describe('PUT /client/update', function () {
    it('respond with 401 Unauthorized', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "cheznestor"})
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) return done(err);

                request(app)
                    .put('/client/update')
                    .send({email: 'anthony@cheznestor.com', key : "firstname", value:"bob"})
                    .set('Content-Type', 'application/json')
                    .set('Authorization', "blah")
                    .expect(401)
                    .end(function(err, res2) {
                    if (err) return done(err);
                    done();
                });
            });
    })
});

describe('PUT /client/update', function () {
    it('respond with 400 Bad Request', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "cheznestor"})
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) return done(err);

                request(app)
                    .put('/client/update')
                    .send({email: 'anthony@cheznestor.com', value:"bob"})
                    .set('Content-Type', 'application/json')
                    .set('Authorization', res.body.token)
                    .expect(400)
                    .end(function(err, res2) {
                    if (err) return done(err);
                    done();
                });
            });
    })
});

describe('PUT /client/update', function () {
    it('respond with 401 Client doesn\'t exist', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "cheznestor"})
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) return done(err);
                request(app)
                    .put('/client/update')
                    .send({email: 'anthony@cheznest.com', key: "firstname", value:"bob"})
                    .set('Content-Type', 'application/json')
                    .set('Authorization', res.body.token)
                    .expect(401)
                    .end(function(err, res2) {
                    if (err) return done(err);
                    done();
                });
            });
    })
});

describe('PUT /client/update', function () {
    it('respond with 500 Internal Error (wrong key)', function (done) {
        request(app)
            .post('/login')
            .send({email: 'anthony@cheznestor.com', password : "cheznestor"})
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                if (err) return done(err);

                request(app)
                    .put('/client/update')
                    .send({email: 'anthony@cheznestor.com', key: "bob", value:"bob"})
                    .set('Content-Type', 'application/json')
                    .set('Authorization', res.body.token)
                    .expect(500)
                    .end(function(err, res2) {
                    if (err) return done(err);
                    done();
                });
            });
    })
});
