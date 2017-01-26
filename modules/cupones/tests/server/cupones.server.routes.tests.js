'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cupone = mongoose.model('Cupone'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cupone;

/**
 * Cupone routes tests
 */
describe('Cupone CRUD tests', function () {

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

    // Save a user to the test db and create new cupone
    user.save(function () {
      cupone = {
        title: 'Cupone Title',
        content: 'Cupone Content'
      };

      done();
    });
  });

  it('should be able to save an cupone if logged in', function (done) {
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

        // Save a new cupone
        agent.post('/api/cupones')
          .send(cupone)
          .expect(200)
          .end(function (cuponeSaveErr, cuponeSaveRes) {
            // Handle cupone save error
            if (cuponeSaveErr) {
              return done(cuponeSaveErr);
            }

            // Get a list of cupones
            agent.get('/api/cupones')
              .end(function (cuponesGetErr, cuponesGetRes) {
                // Handle cupone save error
                if (cuponesGetErr) {
                  return done(cuponesGetErr);
                }

                // Get cupones list
                var cupones = cuponesGetRes.body;

                // Set assertions
                (cupones[0].user._id).should.equal(userId);
                (cupones[0].title).should.match('Cupone Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an cupone if not logged in', function (done) {
    agent.post('/api/cupones')
      .send(cupone)
      .expect(403)
      .end(function (cuponeSaveErr, cuponeSaveRes) {
        // Call the assertion callback
        done(cuponeSaveErr);
      });
  });

  it('should not be able to save an cupone if no title is provided', function (done) {
    // Invalidate title field
    cupone.title = '';

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

        // Save a new cupone
        agent.post('/api/cupones')
          .send(cupone)
          .expect(400)
          .end(function (cuponeSaveErr, cuponeSaveRes) {
            // Set message assertion
            (cuponeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle cupone save error
            done(cuponeSaveErr);
          });
      });
  });

  it('should be able to update an cupone if signed in', function (done) {
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

        // Save a new cupone
        agent.post('/api/cupones')
          .send(cupone)
          .expect(200)
          .end(function (cuponeSaveErr, cuponeSaveRes) {
            // Handle cupone save error
            if (cuponeSaveErr) {
              return done(cuponeSaveErr);
            }

            // Update cupone title
            cupone.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing cupone
            agent.put('/api/cupones/' + cuponeSaveRes.body._id)
              .send(cupone)
              .expect(200)
              .end(function (cuponeUpdateErr, cuponeUpdateRes) {
                // Handle cupone update error
                if (cuponeUpdateErr) {
                  return done(cuponeUpdateErr);
                }

                // Set assertions
                (cuponeUpdateRes.body._id).should.equal(cuponeSaveRes.body._id);
                (cuponeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of cupones if not signed in', function (done) {
    // Create new cupone model instance
    var cuponeObj = new Cupone(cupone);

    // Save the cupone
    cuponeObj.save(function () {
      // Request cupones
      request(app).get('/api/cupones')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single cupone if not signed in', function (done) {
    // Create new cupone model instance
    var cuponeObj = new Cupone(cupone);

    // Save the cupone
    cuponeObj.save(function () {
      request(app).get('/api/cupones/' + cuponeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', cupone.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single cupone with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cupones/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cupone is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single cupone which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent cupone
    request(app).get('/api/cupones/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No cupone with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an cupone if signed in', function (done) {
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

        // Save a new cupone
        agent.post('/api/cupones')
          .send(cupone)
          .expect(200)
          .end(function (cuponeSaveErr, cuponeSaveRes) {
            // Handle cupone save error
            if (cuponeSaveErr) {
              return done(cuponeSaveErr);
            }

            // Delete an existing cupone
            agent.delete('/api/cupones/' + cuponeSaveRes.body._id)
              .send(cupone)
              .expect(200)
              .end(function (cuponeDeleteErr, cuponeDeleteRes) {
                // Handle cupone error error
                if (cuponeDeleteErr) {
                  return done(cuponeDeleteErr);
                }

                // Set assertions
                (cuponeDeleteRes.body._id).should.equal(cuponeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an cupone if not signed in', function (done) {
    // Set cupone user
    cupone.user = user;

    // Create new cupone model instance
    var cuponeObj = new Cupone(cupone);

    // Save the cupone
    cuponeObj.save(function () {
      // Try deleting cupone
      request(app).delete('/api/cupones/' + cuponeObj._id)
        .expect(403)
        .end(function (cuponeDeleteErr, cuponeDeleteRes) {
          // Set message assertion
          (cuponeDeleteRes.body.message).should.match('User is not authorized');

          // Handle cupone error error
          done(cuponeDeleteErr);
        });

    });
  });

  it('should be able to get a single cupone that has an orphaned user reference', function (done) {
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

          // Save a new cupone
          agent.post('/api/cupones')
            .send(cupone)
            .expect(200)
            .end(function (cuponeSaveErr, cuponeSaveRes) {
              // Handle cupone save error
              if (cuponeSaveErr) {
                return done(cuponeSaveErr);
              }

              // Set assertions on new cupone
              (cuponeSaveRes.body.title).should.equal(cupone.title);
              should.exist(cuponeSaveRes.body.user);
              should.equal(cuponeSaveRes.body.user._id, orphanId);

              // force the cupone to have an orphaned user reference
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

                    // Get the cupone
                    agent.get('/api/cupones/' + cuponeSaveRes.body._id)
                      .expect(200)
                      .end(function (cuponeInfoErr, cuponeInfoRes) {
                        // Handle cupone error
                        if (cuponeInfoErr) {
                          return done(cuponeInfoErr);
                        }

                        // Set assertions
                        (cuponeInfoRes.body._id).should.equal(cuponeSaveRes.body._id);
                        (cuponeInfoRes.body.title).should.equal(cupone.title);
                        should.equal(cuponeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single cupone if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new cupone model instance
    cupone.user = user;
    var cuponeObj = new Cupone(cupone);

    // Save the cupone
    cuponeObj.save(function () {
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

          // Save a new cupone
          agent.post('/api/cupones')
            .send(cupone)
            .expect(200)
            .end(function (cuponeSaveErr, cuponeSaveRes) {
              // Handle cupone save error
              if (cuponeSaveErr) {
                return done(cuponeSaveErr);
              }

              // Get the cupone
              agent.get('/api/cupones/' + cuponeSaveRes.body._id)
                .expect(200)
                .end(function (cuponeInfoErr, cuponeInfoRes) {
                  // Handle cupone error
                  if (cuponeInfoErr) {
                    return done(cuponeInfoErr);
                  }

                  // Set assertions
                  (cuponeInfoRes.body._id).should.equal(cuponeSaveRes.body._id);
                  (cuponeInfoRes.body.title).should.equal(cupone.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (cuponeInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single cupone if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new cupone model instance
    var cuponeObj = new Cupone(cupone);

    // Save the cupone
    cuponeObj.save(function () {
      request(app).get('/api/cupones/' + cuponeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', cupone.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single cupone, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Cupone
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

          // Save a new cupone
          agent.post('/api/cupones')
            .send(cupone)
            .expect(200)
            .end(function (cuponeSaveErr, cuponeSaveRes) {
              // Handle cupone save error
              if (cuponeSaveErr) {
                return done(cuponeSaveErr);
              }

              // Set assertions on new cupone
              (cuponeSaveRes.body.title).should.equal(cupone.title);
              should.exist(cuponeSaveRes.body.user);
              should.equal(cuponeSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the cupone
                  agent.get('/api/cupones/' + cuponeSaveRes.body._id)
                    .expect(200)
                    .end(function (cuponeInfoErr, cuponeInfoRes) {
                      // Handle cupone error
                      if (cuponeInfoErr) {
                        return done(cuponeInfoErr);
                      }

                      // Set assertions
                      (cuponeInfoRes.body._id).should.equal(cuponeSaveRes.body._id);
                      (cuponeInfoRes.body.title).should.equal(cupone.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (cuponeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Cupone.remove().exec(done);
    });
  });
});
