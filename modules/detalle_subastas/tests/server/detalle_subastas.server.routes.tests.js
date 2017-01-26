'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Detalle_subasta = mongoose.model('Detalle_subasta'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  detalle_subasta;

/**
 * Detalle_subasta routes tests
 */
describe('Detalle_subasta CRUD tests', function () {

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

    // Save a user to the test db and create new detalle_subasta
    user.save(function () {
      detalle_subasta = {
        title: 'Detalle_subasta Title',
        content: 'Detalle_subasta Content'
      };

      done();
    });
  });

  it('should be able to save an detalle_subasta if logged in', function (done) {
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

        // Save a new detalle_subasta
        agent.post('/api/detalle_subastas')
          .send(detalle_subasta)
          .expect(200)
          .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
            // Handle detalle_subasta save error
            if (detalle_subastaSaveErr) {
              return done(detalle_subastaSaveErr);
            }

            // Get a list of detalle_subastas
            agent.get('/api/detalle_subastas')
              .end(function (detalle_subastasGetErr, detalle_subastasGetRes) {
                // Handle detalle_subasta save error
                if (detalle_subastasGetErr) {
                  return done(detalle_subastasGetErr);
                }

                // Get detalle_subastas list
                var detalle_subastas = detalle_subastasGetRes.body;

                // Set assertions
                (detalle_subastas[0].user._id).should.equal(userId);
                (detalle_subastas[0].title).should.match('Detalle_subasta Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an detalle_subasta if not logged in', function (done) {
    agent.post('/api/detalle_subastas')
      .send(detalle_subasta)
      .expect(403)
      .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
        // Call the assertion callback
        done(detalle_subastaSaveErr);
      });
  });

  it('should not be able to save an detalle_subasta if no title is provided', function (done) {
    // Invalidate title field
    detalle_subasta.title = '';

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

        // Save a new detalle_subasta
        agent.post('/api/detalle_subastas')
          .send(detalle_subasta)
          .expect(400)
          .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
            // Set message assertion
            (detalle_subastaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle detalle_subasta save error
            done(detalle_subastaSaveErr);
          });
      });
  });

  it('should be able to update an detalle_subasta if signed in', function (done) {
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

        // Save a new detalle_subasta
        agent.post('/api/detalle_subastas')
          .send(detalle_subasta)
          .expect(200)
          .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
            // Handle detalle_subasta save error
            if (detalle_subastaSaveErr) {
              return done(detalle_subastaSaveErr);
            }

            // Update detalle_subasta title
            detalle_subasta.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing detalle_subasta
            agent.put('/api/detalle_subastas/' + detalle_subastaSaveRes.body._id)
              .send(detalle_subasta)
              .expect(200)
              .end(function (detalle_subastaUpdateErr, detalle_subastaUpdateRes) {
                // Handle detalle_subasta update error
                if (detalle_subastaUpdateErr) {
                  return done(detalle_subastaUpdateErr);
                }

                // Set assertions
                (detalle_subastaUpdateRes.body._id).should.equal(detalle_subastaSaveRes.body._id);
                (detalle_subastaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of detalle_subastas if not signed in', function (done) {
    // Create new detalle_subasta model instance
    var detalle_subastaObj = new Detalle_subasta(detalle_subasta);

    // Save the detalle_subasta
    detalle_subastaObj.save(function () {
      // Request detalle_subastas
      request(app).get('/api/detalle_subastas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single detalle_subasta if not signed in', function (done) {
    // Create new detalle_subasta model instance
    var detalle_subastaObj = new Detalle_subasta(detalle_subasta);

    // Save the detalle_subasta
    detalle_subastaObj.save(function () {
      request(app).get('/api/detalle_subastas/' + detalle_subastaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', detalle_subasta.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single detalle_subasta with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/detalle_subastas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Detalle_subasta is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single detalle_subasta which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent detalle_subasta
    request(app).get('/api/detalle_subastas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No detalle_subasta with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an detalle_subasta if signed in', function (done) {
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

        // Save a new detalle_subasta
        agent.post('/api/detalle_subastas')
          .send(detalle_subasta)
          .expect(200)
          .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
            // Handle detalle_subasta save error
            if (detalle_subastaSaveErr) {
              return done(detalle_subastaSaveErr);
            }

            // Delete an existing detalle_subasta
            agent.delete('/api/detalle_subastas/' + detalle_subastaSaveRes.body._id)
              .send(detalle_subasta)
              .expect(200)
              .end(function (detalle_subastaDeleteErr, detalle_subastaDeleteRes) {
                // Handle detalle_subasta error error
                if (detalle_subastaDeleteErr) {
                  return done(detalle_subastaDeleteErr);
                }

                // Set assertions
                (detalle_subastaDeleteRes.body._id).should.equal(detalle_subastaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an detalle_subasta if not signed in', function (done) {
    // Set detalle_subasta user
    detalle_subasta.user = user;

    // Create new detalle_subasta model instance
    var detalle_subastaObj = new Detalle_subasta(detalle_subasta);

    // Save the detalle_subasta
    detalle_subastaObj.save(function () {
      // Try deleting detalle_subasta
      request(app).delete('/api/detalle_subastas/' + detalle_subastaObj._id)
        .expect(403)
        .end(function (detalle_subastaDeleteErr, detalle_subastaDeleteRes) {
          // Set message assertion
          (detalle_subastaDeleteRes.body.message).should.match('User is not authorized');

          // Handle detalle_subasta error error
          done(detalle_subastaDeleteErr);
        });

    });
  });

  it('should be able to get a single detalle_subasta that has an orphaned user reference', function (done) {
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

          // Save a new detalle_subasta
          agent.post('/api/detalle_subastas')
            .send(detalle_subasta)
            .expect(200)
            .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
              // Handle detalle_subasta save error
              if (detalle_subastaSaveErr) {
                return done(detalle_subastaSaveErr);
              }

              // Set assertions on new detalle_subasta
              (detalle_subastaSaveRes.body.title).should.equal(detalle_subasta.title);
              should.exist(detalle_subastaSaveRes.body.user);
              should.equal(detalle_subastaSaveRes.body.user._id, orphanId);

              // force the detalle_subasta to have an orphaned user reference
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

                    // Get the detalle_subasta
                    agent.get('/api/detalle_subastas/' + detalle_subastaSaveRes.body._id)
                      .expect(200)
                      .end(function (detalle_subastaInfoErr, detalle_subastaInfoRes) {
                        // Handle detalle_subasta error
                        if (detalle_subastaInfoErr) {
                          return done(detalle_subastaInfoErr);
                        }

                        // Set assertions
                        (detalle_subastaInfoRes.body._id).should.equal(detalle_subastaSaveRes.body._id);
                        (detalle_subastaInfoRes.body.title).should.equal(detalle_subasta.title);
                        should.equal(detalle_subastaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single detalle_subasta if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new detalle_subasta model instance
    detalle_subasta.user = user;
    var detalle_subastaObj = new Detalle_subasta(detalle_subasta);

    // Save the detalle_subasta
    detalle_subastaObj.save(function () {
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

          // Save a new detalle_subasta
          agent.post('/api/detalle_subastas')
            .send(detalle_subasta)
            .expect(200)
            .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
              // Handle detalle_subasta save error
              if (detalle_subastaSaveErr) {
                return done(detalle_subastaSaveErr);
              }

              // Get the detalle_subasta
              agent.get('/api/detalle_subastas/' + detalle_subastaSaveRes.body._id)
                .expect(200)
                .end(function (detalle_subastaInfoErr, detalle_subastaInfoRes) {
                  // Handle detalle_subasta error
                  if (detalle_subastaInfoErr) {
                    return done(detalle_subastaInfoErr);
                  }

                  // Set assertions
                  (detalle_subastaInfoRes.body._id).should.equal(detalle_subastaSaveRes.body._id);
                  (detalle_subastaInfoRes.body.title).should.equal(detalle_subasta.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (detalle_subastaInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single detalle_subasta if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new detalle_subasta model instance
    var detalle_subastaObj = new Detalle_subasta(detalle_subasta);

    // Save the detalle_subasta
    detalle_subastaObj.save(function () {
      request(app).get('/api/detalle_subastas/' + detalle_subastaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', detalle_subasta.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single detalle_subasta, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Detalle_subasta
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

          // Save a new detalle_subasta
          agent.post('/api/detalle_subastas')
            .send(detalle_subasta)
            .expect(200)
            .end(function (detalle_subastaSaveErr, detalle_subastaSaveRes) {
              // Handle detalle_subasta save error
              if (detalle_subastaSaveErr) {
                return done(detalle_subastaSaveErr);
              }

              // Set assertions on new detalle_subasta
              (detalle_subastaSaveRes.body.title).should.equal(detalle_subasta.title);
              should.exist(detalle_subastaSaveRes.body.user);
              should.equal(detalle_subastaSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the detalle_subasta
                  agent.get('/api/detalle_subastas/' + detalle_subastaSaveRes.body._id)
                    .expect(200)
                    .end(function (detalle_subastaInfoErr, detalle_subastaInfoRes) {
                      // Handle detalle_subasta error
                      if (detalle_subastaInfoErr) {
                        return done(detalle_subastaInfoErr);
                      }

                      // Set assertions
                      (detalle_subastaInfoRes.body._id).should.equal(detalle_subastaSaveRes.body._id);
                      (detalle_subastaInfoRes.body.title).should.equal(detalle_subasta.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (detalle_subastaInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Detalle_subasta.remove().exec(done);
    });
  });
});
