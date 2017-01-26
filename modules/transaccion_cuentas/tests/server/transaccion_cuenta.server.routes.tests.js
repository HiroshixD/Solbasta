'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaccion_cuenta = mongoose.model('Transaccion_cuenta'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  transaccion_cuenta;

/**
 * Transaccion_cuenta routes tests
 */
describe('Transaccion_cuenta CRUD tests', function () {

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

    // Save a user to the test db and create new transaccion_cuenta
    user.save(function () {
      transaccion_cuenta = {
        title: 'Transaccion_cuenta Title',
        content: 'Transaccion_cuenta Content'
      };

      done();
    });
  });

  it('should be able to save an transaccion_cuenta if logged in', function (done) {
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

        // Save a new transaccion_cuenta
        agent.post('/api/transaccion_cuentas')
          .send(transaccion_cuenta)
          .expect(200)
          .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
            // Handle transaccion_cuenta save error
            if (transaccion_cuentaSaveErr) {
              return done(transaccion_cuentaSaveErr);
            }

            // Get a list of transaccion_cuentas
            agent.get('/api/transaccion_cuentas')
              .end(function (transaccion_cuentasGetErr, transaccion_cuentasGetRes) {
                // Handle transaccion_cuenta save error
                if (transaccion_cuentasGetErr) {
                  return done(transaccion_cuentasGetErr);
                }

                // Get transaccion_cuentas list
                var transaccion_cuentas = transaccion_cuentasGetRes.body;

                // Set assertions
                (transaccion_cuentas[0].user._id).should.equal(userId);
                (transaccion_cuentas[0].title).should.match('Transaccion_cuenta Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an transaccion_cuenta if not logged in', function (done) {
    agent.post('/api/transaccion_cuentas')
      .send(transaccion_cuenta)
      .expect(403)
      .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
        // Call the assertion callback
        done(transaccion_cuentaSaveErr);
      });
  });

  it('should not be able to save an transaccion_cuenta if no title is provided', function (done) {
    // Invalidate title field
    transaccion_cuenta.title = '';

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

        // Save a new transaccion_cuenta
        agent.post('/api/transaccion_cuentas')
          .send(transaccion_cuenta)
          .expect(400)
          .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
            // Set message assertion
            (transaccion_cuentaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle transaccion_cuenta save error
            done(transaccion_cuentaSaveErr);
          });
      });
  });

  it('should be able to update an transaccion_cuenta if signed in', function (done) {
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

        // Save a new transaccion_cuenta
        agent.post('/api/transaccion_cuentas')
          .send(transaccion_cuenta)
          .expect(200)
          .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
            // Handle transaccion_cuenta save error
            if (transaccion_cuentaSaveErr) {
              return done(transaccion_cuentaSaveErr);
            }

            // Update transaccion_cuenta title
            transaccion_cuenta.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing transaccion_cuenta
            agent.put('/api/transaccion_cuentas/' + transaccion_cuentaSaveRes.body._id)
              .send(transaccion_cuenta)
              .expect(200)
              .end(function (transaccion_cuentaUpdateErr, transaccion_cuentaUpdateRes) {
                // Handle transaccion_cuenta update error
                if (transaccion_cuentaUpdateErr) {
                  return done(transaccion_cuentaUpdateErr);
                }

                // Set assertions
                (transaccion_cuentaUpdateRes.body._id).should.equal(transaccion_cuentaSaveRes.body._id);
                (transaccion_cuentaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of transaccion_cuentas if not signed in', function (done) {
    // Create new transaccion_cuenta model instance
    var transaccion_cuentaObj = new Transaccion_cuenta(transaccion_cuenta);

    // Save the transaccion_cuenta
    transaccion_cuentaObj.save(function () {
      // Request transaccion_cuentas
      request(app).get('/api/transaccion_cuentas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single transaccion_cuenta if not signed in', function (done) {
    // Create new transaccion_cuenta model instance
    var transaccion_cuentaObj = new Transaccion_cuenta(transaccion_cuenta);

    // Save the transaccion_cuenta
    transaccion_cuentaObj.save(function () {
      request(app).get('/api/transaccion_cuentas/' + transaccion_cuentaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', transaccion_cuenta.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single transaccion_cuenta with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/transaccion_cuentas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Transaccion_cuenta is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single transaccion_cuenta which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent transaccion_cuenta
    request(app).get('/api/transaccion_cuentas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No transaccion_cuenta with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an transaccion_cuenta if signed in', function (done) {
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

        // Save a new transaccion_cuenta
        agent.post('/api/transaccion_cuentas')
          .send(transaccion_cuenta)
          .expect(200)
          .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
            // Handle transaccion_cuenta save error
            if (transaccion_cuentaSaveErr) {
              return done(transaccion_cuentaSaveErr);
            }

            // Delete an existing transaccion_cuenta
            agent.delete('/api/transaccion_cuentas/' + transaccion_cuentaSaveRes.body._id)
              .send(transaccion_cuenta)
              .expect(200)
              .end(function (transaccion_cuentaDeleteErr, transaccion_cuentaDeleteRes) {
                // Handle transaccion_cuenta error error
                if (transaccion_cuentaDeleteErr) {
                  return done(transaccion_cuentaDeleteErr);
                }

                // Set assertions
                (transaccion_cuentaDeleteRes.body._id).should.equal(transaccion_cuentaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an transaccion_cuenta if not signed in', function (done) {
    // Set transaccion_cuenta user
    transaccion_cuenta.user = user;

    // Create new transaccion_cuenta model instance
    var transaccion_cuentaObj = new Transaccion_cuenta(transaccion_cuenta);

    // Save the transaccion_cuenta
    transaccion_cuentaObj.save(function () {
      // Try deleting transaccion_cuenta
      request(app).delete('/api/transaccion_cuentas/' + transaccion_cuentaObj._id)
        .expect(403)
        .end(function (transaccion_cuentaDeleteErr, transaccion_cuentaDeleteRes) {
          // Set message assertion
          (transaccion_cuentaDeleteRes.body.message).should.match('User is not authorized');

          // Handle transaccion_cuenta error error
          done(transaccion_cuentaDeleteErr);
        });

    });
  });

  it('should be able to get a single transaccion_cuenta that has an orphaned user reference', function (done) {
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

          // Save a new transaccion_cuenta
          agent.post('/api/transaccion_cuentas')
            .send(transaccion_cuenta)
            .expect(200)
            .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
              // Handle transaccion_cuenta save error
              if (transaccion_cuentaSaveErr) {
                return done(transaccion_cuentaSaveErr);
              }

              // Set assertions on new transaccion_cuenta
              (transaccion_cuentaSaveRes.body.title).should.equal(transaccion_cuenta.title);
              should.exist(transaccion_cuentaSaveRes.body.user);
              should.equal(transaccion_cuentaSaveRes.body.user._id, orphanId);

              // force the transaccion_cuenta to have an orphaned user reference
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

                    // Get the transaccion_cuenta
                    agent.get('/api/transaccion_cuentas/' + transaccion_cuentaSaveRes.body._id)
                      .expect(200)
                      .end(function (transaccion_cuentaInfoErr, transaccion_cuentaInfoRes) {
                        // Handle transaccion_cuenta error
                        if (transaccion_cuentaInfoErr) {
                          return done(transaccion_cuentaInfoErr);
                        }

                        // Set assertions
                        (transaccion_cuentaInfoRes.body._id).should.equal(transaccion_cuentaSaveRes.body._id);
                        (transaccion_cuentaInfoRes.body.title).should.equal(transaccion_cuenta.title);
                        should.equal(transaccion_cuentaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single transaccion_cuenta if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new transaccion_cuenta model instance
    transaccion_cuenta.user = user;
    var transaccion_cuentaObj = new Transaccion_cuenta(transaccion_cuenta);

    // Save the transaccion_cuenta
    transaccion_cuentaObj.save(function () {
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

          // Save a new transaccion_cuenta
          agent.post('/api/transaccion_cuentas')
            .send(transaccion_cuenta)
            .expect(200)
            .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
              // Handle transaccion_cuenta save error
              if (transaccion_cuentaSaveErr) {
                return done(transaccion_cuentaSaveErr);
              }

              // Get the transaccion_cuenta
              agent.get('/api/transaccion_cuentas/' + transaccion_cuentaSaveRes.body._id)
                .expect(200)
                .end(function (transaccion_cuentaInfoErr, transaccion_cuentaInfoRes) {
                  // Handle transaccion_cuenta error
                  if (transaccion_cuentaInfoErr) {
                    return done(transaccion_cuentaInfoErr);
                  }

                  // Set assertions
                  (transaccion_cuentaInfoRes.body._id).should.equal(transaccion_cuentaSaveRes.body._id);
                  (transaccion_cuentaInfoRes.body.title).should.equal(transaccion_cuenta.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (transaccion_cuentaInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single transaccion_cuenta if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new transaccion_cuenta model instance
    var transaccion_cuentaObj = new Transaccion_cuenta(transaccion_cuenta);

    // Save the transaccion_cuenta
    transaccion_cuentaObj.save(function () {
      request(app).get('/api/transaccion_cuentas/' + transaccion_cuentaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', transaccion_cuenta.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single transaccion_cuenta, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Transaccion_cuenta
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

          // Save a new transaccion_cuenta
          agent.post('/api/transaccion_cuentas')
            .send(transaccion_cuenta)
            .expect(200)
            .end(function (transaccion_cuentaSaveErr, transaccion_cuentaSaveRes) {
              // Handle transaccion_cuenta save error
              if (transaccion_cuentaSaveErr) {
                return done(transaccion_cuentaSaveErr);
              }

              // Set assertions on new transaccion_cuenta
              (transaccion_cuentaSaveRes.body.title).should.equal(transaccion_cuenta.title);
              should.exist(transaccion_cuentaSaveRes.body.user);
              should.equal(transaccion_cuentaSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the transaccion_cuenta
                  agent.get('/api/transaccion_cuentas/' + transaccion_cuentaSaveRes.body._id)
                    .expect(200)
                    .end(function (transaccion_cuentaInfoErr, transaccion_cuentaInfoRes) {
                      // Handle transaccion_cuenta error
                      if (transaccion_cuentaInfoErr) {
                        return done(transaccion_cuentaInfoErr);
                      }

                      // Set assertions
                      (transaccion_cuentaInfoRes.body._id).should.equal(transaccion_cuentaSaveRes.body._id);
                      (transaccion_cuentaInfoRes.body.title).should.equal(transaccion_cuenta.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (transaccion_cuentaInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Transaccion_cuenta.remove().exec(done);
    });
  });
});
