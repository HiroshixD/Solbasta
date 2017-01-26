'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaccion_saldo = mongoose.model('Transaccion_saldo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  transaccion_saldo;

/**
 * Transaccion_saldo routes tests
 */
describe('Transaccion_saldo CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new transaccion_saldo
    user.save(function () {
      transaccion_saldo = {
        title: 'Transaccion_saldo Title',
        content: 'Transaccion_saldo Content'
      };

      done();
    });
  });

  it('should be able to save an transaccion_saldo if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new transaccion_saldo
        agent.post('/api/transaccion_saldos')
          .send(transaccion_saldo)
          .expect(200)
          .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
            // Handle transaccion_saldo save error
            if (transaccion_saldoSaveErr) {
              return done(transaccion_saldoSaveErr);
            }

            // Get a list of transaccion_saldos
            agent.get('/api/transaccion_saldos')
              .end(function (transaccion_saldosGetErr, transaccion_saldosGetRes) {
                // Handle transaccion_saldo save error
                if (transaccion_saldosGetErr) {
                  return done(transaccion_saldosGetErr);
                }

                // Get transaccion_saldos list
                var transaccion_saldos = transaccion_saldosGetRes.body;

                // Set assertions
                (transaccion_saldos[0].user._id).should.equal(userId);
                (transaccion_saldos[0].title).should.match('Transaccion_saldo Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an transaccion_saldo if not logged in', function (done) {
    agent.post('/api/transaccion_saldos')
      .send(transaccion_saldo)
      .expect(403)
      .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
        // Call the assertion callback
        done(transaccion_saldoSaveErr);
      });
  });

  it('should not be able to save an transaccion_saldo if no title is provided', function (done) {
    // Invalidate title field
    transaccion_saldo.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new transaccion_saldo
        agent.post('/api/transaccion_saldos')
          .send(transaccion_saldo)
          .expect(400)
          .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
            // Set message assertion
            (transaccion_saldoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle transaccion_saldo save error
            done(transaccion_saldoSaveErr);
          });
      });
  });

  it('should be able to update an transaccion_saldo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new transaccion_saldo
        agent.post('/api/transaccion_saldos')
          .send(transaccion_saldo)
          .expect(200)
          .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
            // Handle transaccion_saldo save error
            if (transaccion_saldoSaveErr) {
              return done(transaccion_saldoSaveErr);
            }

            // Update transaccion_saldo title
            transaccion_saldo.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing transaccion_saldo
            agent.put('/api/transaccion_saldos/' + transaccion_saldoSaveRes.body._id)
              .send(transaccion_saldo)
              .expect(200)
              .end(function (transaccion_saldoUpdateErr, transaccion_saldoUpdateRes) {
                // Handle transaccion_saldo update error
                if (transaccion_saldoUpdateErr) {
                  return done(transaccion_saldoUpdateErr);
                }

                // Set assertions
                (transaccion_saldoUpdateRes.body._id).should.equal(transaccion_saldoSaveRes.body._id);
                (transaccion_saldoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of transaccion_saldos if not signed in', function (done) {
    // Create new transaccion_saldo model instance
    var transaccion_saldoObj = new Transaccion_saldo(transaccion_saldo);

    // Save the transaccion_saldo
    transaccion_saldoObj.save(function () {
      // Request transaccion_saldos
      request(app).get('/api/transaccion_saldos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single transaccion_saldo if not signed in', function (done) {
    // Create new transaccion_saldo model instance
    var transaccion_saldoObj = new Transaccion_saldo(transaccion_saldo);

    // Save the transaccion_saldo
    transaccion_saldoObj.save(function () {
      request(app).get('/api/transaccion_saldos/' + transaccion_saldoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', transaccion_saldo.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single transaccion_saldo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/transaccion_saldos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Transaccion_saldo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single transaccion_saldo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent transaccion_saldo
    request(app).get('/api/transaccion_saldos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No transaccion_saldo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an transaccion_saldo if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new transaccion_saldo
        agent.post('/api/transaccion_saldos')
          .send(transaccion_saldo)
          .expect(200)
          .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
            // Handle transaccion_saldo save error
            if (transaccion_saldoSaveErr) {
              return done(transaccion_saldoSaveErr);
            }

            // Delete an existing transaccion_saldo
            agent.delete('/api/transaccion_saldos/' + transaccion_saldoSaveRes.body._id)
              .send(transaccion_saldo)
              .expect(200)
              .end(function (transaccion_saldoDeleteErr, transaccion_saldoDeleteRes) {
                // Handle transaccion_saldo error error
                if (transaccion_saldoDeleteErr) {
                  return done(transaccion_saldoDeleteErr);
                }

                // Set assertions
                (transaccion_saldoDeleteRes.body._id).should.equal(transaccion_saldoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an transaccion_saldo if not signed in', function (done) {
    // Set transaccion_saldo user
    transaccion_saldo.user = user;

    // Create new transaccion_saldo model instance
    var transaccion_saldoObj = new Transaccion_saldo(transaccion_saldo);

    // Save the transaccion_saldo
    transaccion_saldoObj.save(function () {
      // Try deleting transaccion_saldo
      request(app).delete('/api/transaccion_saldos/' + transaccion_saldoObj._id)
        .expect(403)
        .end(function (transaccion_saldoDeleteErr, transaccion_saldoDeleteRes) {
          // Set message assertion
          (transaccion_saldoDeleteRes.body.message).should.match('User is not authorized');

          // Handle transaccion_saldo error error
          done(transaccion_saldoDeleteErr);
        });

    });
  });

  it('should be able to get a single transaccion_saldo that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new transaccion_saldo
          agent.post('/api/transaccion_saldos')
            .send(transaccion_saldo)
            .expect(200)
            .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
              // Handle transaccion_saldo save error
              if (transaccion_saldoSaveErr) {
                return done(transaccion_saldoSaveErr);
              }

              // Set assertions on new transaccion_saldo
              (transaccion_saldoSaveRes.body.title).should.equal(transaccion_saldo.title);
              should.exist(transaccion_saldoSaveRes.body.user);
              should.equal(transaccion_saldoSaveRes.body.user._id, orphanId);

              // force the transaccion_saldo to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the transaccion_saldo
                    agent.get('/api/transaccion_saldos/' + transaccion_saldoSaveRes.body._id)
                      .expect(200)
                      .end(function (transaccion_saldoInfoErr, transaccion_saldoInfoRes) {
                        // Handle transaccion_saldo error
                        if (transaccion_saldoInfoErr) {
                          return done(transaccion_saldoInfoErr);
                        }

                        // Set assertions
                        (transaccion_saldoInfoRes.body._id).should.equal(transaccion_saldoSaveRes.body._id);
                        (transaccion_saldoInfoRes.body.title).should.equal(transaccion_saldo.title);
                        should.equal(transaccion_saldoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single transaccion_saldo if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new transaccion_saldo model instance
    transaccion_saldo.user = user;
    var transaccion_saldoObj = new Transaccion_saldo(transaccion_saldo);

    // Save the transaccion_saldo
    transaccion_saldoObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new transaccion_saldo
          agent.post('/api/transaccion_saldos')
            .send(transaccion_saldo)
            .expect(200)
            .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
              // Handle transaccion_saldo save error
              if (transaccion_saldoSaveErr) {
                return done(transaccion_saldoSaveErr);
              }

              // Get the transaccion_saldo
              agent.get('/api/transaccion_saldos/' + transaccion_saldoSaveRes.body._id)
                .expect(200)
                .end(function (transaccion_saldoInfoErr, transaccion_saldoInfoRes) {
                  // Handle transaccion_saldo error
                  if (transaccion_saldoInfoErr) {
                    return done(transaccion_saldoInfoErr);
                  }

                  // Set assertions
                  (transaccion_saldoInfoRes.body._id).should.equal(transaccion_saldoSaveRes.body._id);
                  (transaccion_saldoInfoRes.body.title).should.equal(transaccion_saldo.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (transaccion_saldoInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single transaccion_saldo if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new transaccion_saldo model instance
    var transaccion_saldoObj = new Transaccion_saldo(transaccion_saldo);

    // Save the transaccion_saldo
    transaccion_saldoObj.save(function () {
      request(app).get('/api/transaccion_saldos/' + transaccion_saldoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', transaccion_saldo.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single transaccion_saldo, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Transaccion_saldo
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new transaccion_saldo
          agent.post('/api/transaccion_saldos')
            .send(transaccion_saldo)
            .expect(200)
            .end(function (transaccion_saldoSaveErr, transaccion_saldoSaveRes) {
              // Handle transaccion_saldo save error
              if (transaccion_saldoSaveErr) {
                return done(transaccion_saldoSaveErr);
              }

              // Set assertions on new transaccion_saldo
              (transaccion_saldoSaveRes.body.title).should.equal(transaccion_saldo.title);
              should.exist(transaccion_saldoSaveRes.body.user);
              should.equal(transaccion_saldoSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the transaccion_saldo
                  agent.get('/api/transaccion_saldos/' + transaccion_saldoSaveRes.body._id)
                    .expect(200)
                    .end(function (transaccion_saldoInfoErr, transaccion_saldoInfoRes) {
                      // Handle transaccion_saldo error
                      if (transaccion_saldoInfoErr) {
                        return done(transaccion_saldoInfoErr);
                      }

                      // Set assertions
                      (transaccion_saldoInfoRes.body._id).should.equal(transaccion_saldoSaveRes.body._id);
                      (transaccion_saldoInfoRes.body.title).should.equal(transaccion_saldo.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (transaccion_saldoInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Transaccion_saldo.remove().exec(done);
    });
  });
});
