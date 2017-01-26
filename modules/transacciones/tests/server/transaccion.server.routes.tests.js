'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Transaccion = mongoose.model('Transaccion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  transaccion;

/**
 * Transaccion routes tests
 */
describe('Transaccion CRUD tests', function () {

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

    // Save a user to the test db and create new transaccion
    user.save(function () {
      transaccion = {
        title: 'Transaccion Title',
        content: 'Transaccion Content'
      };

      done();
    });
  });

  it('should be able to save an transaccion if logged in', function (done) {
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

        // Save a new transaccion
        agent.post('/api/transaccions')
          .send(transaccion)
          .expect(200)
          .end(function (transaccionSaveErr, transaccionSaveRes) {
            // Handle transaccion save error
            if (transaccionSaveErr) {
              return done(transaccionSaveErr);
            }

            // Get a list of transaccions
            agent.get('/api/transaccions')
              .end(function (transaccionsGetErr, transaccionsGetRes) {
                // Handle transaccion save error
                if (transaccionsGetErr) {
                  return done(transaccionsGetErr);
                }

                // Get transaccions list
                var transaccions = transaccionsGetRes.body;

                // Set assertions
                (transaccions[0].user._id).should.equal(userId);
                (transaccions[0].title).should.match('Transaccion Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an transaccion if not logged in', function (done) {
    agent.post('/api/transaccions')
      .send(transaccion)
      .expect(403)
      .end(function (transaccionSaveErr, transaccionSaveRes) {
        // Call the assertion callback
        done(transaccionSaveErr);
      });
  });

  it('should not be able to save an transaccion if no title is provided', function (done) {
    // Invalidate title field
    transaccion.title = '';

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

        // Save a new transaccion
        agent.post('/api/transaccions')
          .send(transaccion)
          .expect(400)
          .end(function (transaccionSaveErr, transaccionSaveRes) {
            // Set message assertion
            (transaccionSaveRes.body.message).should.match('Title cannot be blank');

            // Handle transaccion save error
            done(transaccionSaveErr);
          });
      });
  });

  it('should be able to update an transaccion if signed in', function (done) {
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

        // Save a new transaccion
        agent.post('/api/transaccions')
          .send(transaccion)
          .expect(200)
          .end(function (transaccionSaveErr, transaccionSaveRes) {
            // Handle transaccion save error
            if (transaccionSaveErr) {
              return done(transaccionSaveErr);
            }

            // Update transaccion title
            transaccion.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing transaccion
            agent.put('/api/transaccions/' + transaccionSaveRes.body._id)
              .send(transaccion)
              .expect(200)
              .end(function (transaccionUpdateErr, transaccionUpdateRes) {
                // Handle transaccion update error
                if (transaccionUpdateErr) {
                  return done(transaccionUpdateErr);
                }

                // Set assertions
                (transaccionUpdateRes.body._id).should.equal(transaccionSaveRes.body._id);
                (transaccionUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of transaccions if not signed in', function (done) {
    // Create new transaccion model instance
    var transaccionObj = new Transaccion(transaccion);

    // Save the transaccion
    transaccionObj.save(function () {
      // Request transaccions
      request(app).get('/api/transaccions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single transaccion if not signed in', function (done) {
    // Create new transaccion model instance
    var transaccionObj = new Transaccion(transaccion);

    // Save the transaccion
    transaccionObj.save(function () {
      request(app).get('/api/transaccions/' + transaccionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', transaccion.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single transaccion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/transaccions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Transaccion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single transaccion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent transaccion
    request(app).get('/api/transaccions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No transaccion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an transaccion if signed in', function (done) {
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

        // Save a new transaccion
        agent.post('/api/transaccions')
          .send(transaccion)
          .expect(200)
          .end(function (transaccionSaveErr, transaccionSaveRes) {
            // Handle transaccion save error
            if (transaccionSaveErr) {
              return done(transaccionSaveErr);
            }

            // Delete an existing transaccion
            agent.delete('/api/transaccions/' + transaccionSaveRes.body._id)
              .send(transaccion)
              .expect(200)
              .end(function (transaccionDeleteErr, transaccionDeleteRes) {
                // Handle transaccion error error
                if (transaccionDeleteErr) {
                  return done(transaccionDeleteErr);
                }

                // Set assertions
                (transaccionDeleteRes.body._id).should.equal(transaccionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an transaccion if not signed in', function (done) {
    // Set transaccion user
    transaccion.user = user;

    // Create new transaccion model instance
    var transaccionObj = new Transaccion(transaccion);

    // Save the transaccion
    transaccionObj.save(function () {
      // Try deleting transaccion
      request(app).delete('/api/transaccions/' + transaccionObj._id)
        .expect(403)
        .end(function (transaccionDeleteErr, transaccionDeleteRes) {
          // Set message assertion
          (transaccionDeleteRes.body.message).should.match('User is not authorized');

          // Handle transaccion error error
          done(transaccionDeleteErr);
        });

    });
  });

  it('should be able to get a single transaccion that has an orphaned user reference', function (done) {
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

          // Save a new transaccion
          agent.post('/api/transaccions')
            .send(transaccion)
            .expect(200)
            .end(function (transaccionSaveErr, transaccionSaveRes) {
              // Handle transaccion save error
              if (transaccionSaveErr) {
                return done(transaccionSaveErr);
              }

              // Set assertions on new transaccion
              (transaccionSaveRes.body.title).should.equal(transaccion.title);
              should.exist(transaccionSaveRes.body.user);
              should.equal(transaccionSaveRes.body.user._id, orphanId);

              // force the transaccion to have an orphaned user reference
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

                    // Get the transaccion
                    agent.get('/api/transaccions/' + transaccionSaveRes.body._id)
                      .expect(200)
                      .end(function (transaccionInfoErr, transaccionInfoRes) {
                        // Handle transaccion error
                        if (transaccionInfoErr) {
                          return done(transaccionInfoErr);
                        }

                        // Set assertions
                        (transaccionInfoRes.body._id).should.equal(transaccionSaveRes.body._id);
                        (transaccionInfoRes.body.title).should.equal(transaccion.title);
                        should.equal(transaccionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single transaccion if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new transaccion model instance
    transaccion.user = user;
    var transaccionObj = new Transaccion(transaccion);

    // Save the transaccion
    transaccionObj.save(function () {
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

          // Save a new transaccion
          agent.post('/api/transaccions')
            .send(transaccion)
            .expect(200)
            .end(function (transaccionSaveErr, transaccionSaveRes) {
              // Handle transaccion save error
              if (transaccionSaveErr) {
                return done(transaccionSaveErr);
              }

              // Get the transaccion
              agent.get('/api/transaccions/' + transaccionSaveRes.body._id)
                .expect(200)
                .end(function (transaccionInfoErr, transaccionInfoRes) {
                  // Handle transaccion error
                  if (transaccionInfoErr) {
                    return done(transaccionInfoErr);
                  }

                  // Set assertions
                  (transaccionInfoRes.body._id).should.equal(transaccionSaveRes.body._id);
                  (transaccionInfoRes.body.title).should.equal(transaccion.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (transaccionInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single transaccion if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new transaccion model instance
    var transaccionObj = new Transaccion(transaccion);

    // Save the transaccion
    transaccionObj.save(function () {
      request(app).get('/api/transaccions/' + transaccionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', transaccion.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single transaccion, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Transaccion
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

          // Save a new transaccion
          agent.post('/api/transaccions')
            .send(transaccion)
            .expect(200)
            .end(function (transaccionSaveErr, transaccionSaveRes) {
              // Handle transaccion save error
              if (transaccionSaveErr) {
                return done(transaccionSaveErr);
              }

              // Set assertions on new transaccion
              (transaccionSaveRes.body.title).should.equal(transaccion.title);
              should.exist(transaccionSaveRes.body.user);
              should.equal(transaccionSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the transaccion
                  agent.get('/api/transaccions/' + transaccionSaveRes.body._id)
                    .expect(200)
                    .end(function (transaccionInfoErr, transaccionInfoRes) {
                      // Handle transaccion error
                      if (transaccionInfoErr) {
                        return done(transaccionInfoErr);
                      }

                      // Set assertions
                      (transaccionInfoRes.body._id).should.equal(transaccionSaveRes.body._id);
                      (transaccionInfoRes.body.title).should.equal(transaccion.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (transaccionInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Transaccion.remove().exec(done);
    });
  });
});
