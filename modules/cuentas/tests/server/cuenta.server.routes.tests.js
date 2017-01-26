'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cuenta = mongoose.model('Cuenta'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cuenta;

/**
 * Cuenta routes tests
 */
describe('Cuenta CRUD tests', function () {

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

    // Save a user to the test db and create new cuenta
    user.save(function () {
      cuenta = {
        title: 'Cuenta Title',
        content: 'Cuenta Content'
      };

      done();
    });
  });

  it('should be able to save an cuenta if logged in', function (done) {
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

        // Save a new cuenta
        agent.post('/api/cuentas')
          .send(cuenta)
          .expect(200)
          .end(function (cuentaSaveErr, cuentaSaveRes) {
            // Handle cuenta save error
            if (cuentaSaveErr) {
              return done(cuentaSaveErr);
            }

            // Get a list of cuentas
            agent.get('/api/cuentas')
              .end(function (cuentasGetErr, cuentasGetRes) {
                // Handle cuenta save error
                if (cuentasGetErr) {
                  return done(cuentasGetErr);
                }

                // Get cuentas list
                var cuentas = cuentasGetRes.body;

                // Set assertions
                (cuentas[0].user._id).should.equal(userId);
                (cuentas[0].title).should.match('Cuenta Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an cuenta if not logged in', function (done) {
    agent.post('/api/cuentas')
      .send(cuenta)
      .expect(403)
      .end(function (cuentaSaveErr, cuentaSaveRes) {
        // Call the assertion callback
        done(cuentaSaveErr);
      });
  });

  it('should not be able to save an cuenta if no title is provided', function (done) {
    // Invalidate title field
    cuenta.title = '';

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

        // Save a new cuenta
        agent.post('/api/cuentas')
          .send(cuenta)
          .expect(400)
          .end(function (cuentaSaveErr, cuentaSaveRes) {
            // Set message assertion
            (cuentaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle cuenta save error
            done(cuentaSaveErr);
          });
      });
  });

  it('should be able to update an cuenta if signed in', function (done) {
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

        // Save a new cuenta
        agent.post('/api/cuentas')
          .send(cuenta)
          .expect(200)
          .end(function (cuentaSaveErr, cuentaSaveRes) {
            // Handle cuenta save error
            if (cuentaSaveErr) {
              return done(cuentaSaveErr);
            }

            // Update cuenta title
            cuenta.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing cuenta
            agent.put('/api/cuentas/' + cuentaSaveRes.body._id)
              .send(cuenta)
              .expect(200)
              .end(function (cuentaUpdateErr, cuentaUpdateRes) {
                // Handle cuenta update error
                if (cuentaUpdateErr) {
                  return done(cuentaUpdateErr);
                }

                // Set assertions
                (cuentaUpdateRes.body._id).should.equal(cuentaSaveRes.body._id);
                (cuentaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of cuentas if not signed in', function (done) {
    // Create new cuenta model instance
    var cuentaObj = new Cuenta(cuenta);

    // Save the cuenta
    cuentaObj.save(function () {
      // Request cuentas
      request(app).get('/api/cuentas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single cuenta if not signed in', function (done) {
    // Create new cuenta model instance
    var cuentaObj = new Cuenta(cuenta);

    // Save the cuenta
    cuentaObj.save(function () {
      request(app).get('/api/cuentas/' + cuentaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', cuenta.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single cuenta with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cuentas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cuenta is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single cuenta which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent cuenta
    request(app).get('/api/cuentas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No cuenta with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an cuenta if signed in', function (done) {
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

        // Save a new cuenta
        agent.post('/api/cuentas')
          .send(cuenta)
          .expect(200)
          .end(function (cuentaSaveErr, cuentaSaveRes) {
            // Handle cuenta save error
            if (cuentaSaveErr) {
              return done(cuentaSaveErr);
            }

            // Delete an existing cuenta
            agent.delete('/api/cuentas/' + cuentaSaveRes.body._id)
              .send(cuenta)
              .expect(200)
              .end(function (cuentaDeleteErr, cuentaDeleteRes) {
                // Handle cuenta error error
                if (cuentaDeleteErr) {
                  return done(cuentaDeleteErr);
                }

                // Set assertions
                (cuentaDeleteRes.body._id).should.equal(cuentaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an cuenta if not signed in', function (done) {
    // Set cuenta user
    cuenta.user = user;

    // Create new cuenta model instance
    var cuentaObj = new Cuenta(cuenta);

    // Save the cuenta
    cuentaObj.save(function () {
      // Try deleting cuenta
      request(app).delete('/api/cuentas/' + cuentaObj._id)
        .expect(403)
        .end(function (cuentaDeleteErr, cuentaDeleteRes) {
          // Set message assertion
          (cuentaDeleteRes.body.message).should.match('User is not authorized');

          // Handle cuenta error error
          done(cuentaDeleteErr);
        });

    });
  });

  it('should be able to get a single cuenta that has an orphaned user reference', function (done) {
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

          // Save a new cuenta
          agent.post('/api/cuentas')
            .send(cuenta)
            .expect(200)
            .end(function (cuentaSaveErr, cuentaSaveRes) {
              // Handle cuenta save error
              if (cuentaSaveErr) {
                return done(cuentaSaveErr);
              }

              // Set assertions on new cuenta
              (cuentaSaveRes.body.title).should.equal(cuenta.title);
              should.exist(cuentaSaveRes.body.user);
              should.equal(cuentaSaveRes.body.user._id, orphanId);

              // force the cuenta to have an orphaned user reference
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

                    // Get the cuenta
                    agent.get('/api/cuentas/' + cuentaSaveRes.body._id)
                      .expect(200)
                      .end(function (cuentaInfoErr, cuentaInfoRes) {
                        // Handle cuenta error
                        if (cuentaInfoErr) {
                          return done(cuentaInfoErr);
                        }

                        // Set assertions
                        (cuentaInfoRes.body._id).should.equal(cuentaSaveRes.body._id);
                        (cuentaInfoRes.body.title).should.equal(cuenta.title);
                        should.equal(cuentaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single cuenta if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new cuenta model instance
    cuenta.user = user;
    var cuentaObj = new Cuenta(cuenta);

    // Save the cuenta
    cuentaObj.save(function () {
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

          // Save a new cuenta
          agent.post('/api/cuentas')
            .send(cuenta)
            .expect(200)
            .end(function (cuentaSaveErr, cuentaSaveRes) {
              // Handle cuenta save error
              if (cuentaSaveErr) {
                return done(cuentaSaveErr);
              }

              // Get the cuenta
              agent.get('/api/cuentas/' + cuentaSaveRes.body._id)
                .expect(200)
                .end(function (cuentaInfoErr, cuentaInfoRes) {
                  // Handle cuenta error
                  if (cuentaInfoErr) {
                    return done(cuentaInfoErr);
                  }

                  // Set assertions
                  (cuentaInfoRes.body._id).should.equal(cuentaSaveRes.body._id);
                  (cuentaInfoRes.body.title).should.equal(cuenta.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (cuentaInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single cuenta if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new cuenta model instance
    var cuentaObj = new Cuenta(cuenta);

    // Save the cuenta
    cuentaObj.save(function () {
      request(app).get('/api/cuentas/' + cuentaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', cuenta.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single cuenta, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Cuenta
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

          // Save a new cuenta
          agent.post('/api/cuentas')
            .send(cuenta)
            .expect(200)
            .end(function (cuentaSaveErr, cuentaSaveRes) {
              // Handle cuenta save error
              if (cuentaSaveErr) {
                return done(cuentaSaveErr);
              }

              // Set assertions on new cuenta
              (cuentaSaveRes.body.title).should.equal(cuenta.title);
              should.exist(cuentaSaveRes.body.user);
              should.equal(cuentaSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the cuenta
                  agent.get('/api/cuentas/' + cuentaSaveRes.body._id)
                    .expect(200)
                    .end(function (cuentaInfoErr, cuentaInfoRes) {
                      // Handle cuenta error
                      if (cuentaInfoErr) {
                        return done(cuentaInfoErr);
                      }

                      // Set assertions
                      (cuentaInfoRes.body._id).should.equal(cuentaSaveRes.body._id);
                      (cuentaInfoRes.body.title).should.equal(cuenta.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (cuentaInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Cuenta.remove().exec(done);
    });
  });
});
