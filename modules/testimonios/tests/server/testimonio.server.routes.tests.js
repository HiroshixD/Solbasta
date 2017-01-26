'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Testimonio = mongoose.model('Testimonio'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  testimonio;

/**
 * Testimonio routes tests
 */
describe('Testimonio CRUD tests', function () {

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

    // Save a user to the test db and create new testimonio
    user.save(function () {
      testimonio = {
        title: 'Testimonio Title',
        content: 'Testimonio Content'
      };

      done();
    });
  });

  it('should be able to save an testimonio if logged in', function (done) {
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

        // Save a new testimonio
        agent.post('/api/testimonios')
          .send(testimonio)
          .expect(200)
          .end(function (testimonioSaveErr, testimonioSaveRes) {
            // Handle testimonio save error
            if (testimonioSaveErr) {
              return done(testimonioSaveErr);
            }

            // Get a list of testimonios
            agent.get('/api/testimonios')
              .end(function (testimoniosGetErr, testimoniosGetRes) {
                // Handle testimonio save error
                if (testimoniosGetErr) {
                  return done(testimoniosGetErr);
                }

                // Get testimonios list
                var testimonios = testimoniosGetRes.body;

                // Set assertions
                (testimonios[0].user._id).should.equal(userId);
                (testimonios[0].title).should.match('Testimonio Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an testimonio if not logged in', function (done) {
    agent.post('/api/testimonios')
      .send(testimonio)
      .expect(403)
      .end(function (testimonioSaveErr, testimonioSaveRes) {
        // Call the assertion callback
        done(testimonioSaveErr);
      });
  });

  it('should not be able to save an testimonio if no title is provided', function (done) {
    // Invalidate title field
    testimonio.title = '';

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

        // Save a new testimonio
        agent.post('/api/testimonios')
          .send(testimonio)
          .expect(400)
          .end(function (testimonioSaveErr, testimonioSaveRes) {
            // Set message assertion
            (testimonioSaveRes.body.message).should.match('Title cannot be blank');

            // Handle testimonio save error
            done(testimonioSaveErr);
          });
      });
  });

  it('should be able to update an testimonio if signed in', function (done) {
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

        // Save a new testimonio
        agent.post('/api/testimonios')
          .send(testimonio)
          .expect(200)
          .end(function (testimonioSaveErr, testimonioSaveRes) {
            // Handle testimonio save error
            if (testimonioSaveErr) {
              return done(testimonioSaveErr);
            }

            // Update testimonio title
            testimonio.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing testimonio
            agent.put('/api/testimonios/' + testimonioSaveRes.body._id)
              .send(testimonio)
              .expect(200)
              .end(function (testimonioUpdateErr, testimonioUpdateRes) {
                // Handle testimonio update error
                if (testimonioUpdateErr) {
                  return done(testimonioUpdateErr);
                }

                // Set assertions
                (testimonioUpdateRes.body._id).should.equal(testimonioSaveRes.body._id);
                (testimonioUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of testimonios if not signed in', function (done) {
    // Create new testimonio model instance
    var testimonioObj = new Testimonio(testimonio);

    // Save the testimonio
    testimonioObj.save(function () {
      // Request testimonios
      request(app).get('/api/testimonios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single testimonio if not signed in', function (done) {
    // Create new testimonio model instance
    var testimonioObj = new Testimonio(testimonio);

    // Save the testimonio
    testimonioObj.save(function () {
      request(app).get('/api/testimonios/' + testimonioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', testimonio.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single testimonio with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/testimonios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Testimonio is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single testimonio which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent testimonio
    request(app).get('/api/testimonios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No testimonio with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an testimonio if signed in', function (done) {
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

        // Save a new testimonio
        agent.post('/api/testimonios')
          .send(testimonio)
          .expect(200)
          .end(function (testimonioSaveErr, testimonioSaveRes) {
            // Handle testimonio save error
            if (testimonioSaveErr) {
              return done(testimonioSaveErr);
            }

            // Delete an existing testimonio
            agent.delete('/api/testimonios/' + testimonioSaveRes.body._id)
              .send(testimonio)
              .expect(200)
              .end(function (testimonioDeleteErr, testimonioDeleteRes) {
                // Handle testimonio error error
                if (testimonioDeleteErr) {
                  return done(testimonioDeleteErr);
                }

                // Set assertions
                (testimonioDeleteRes.body._id).should.equal(testimonioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an testimonio if not signed in', function (done) {
    // Set testimonio user
    testimonio.user = user;

    // Create new testimonio model instance
    var testimonioObj = new Testimonio(testimonio);

    // Save the testimonio
    testimonioObj.save(function () {
      // Try deleting testimonio
      request(app).delete('/api/testimonios/' + testimonioObj._id)
        .expect(403)
        .end(function (testimonioDeleteErr, testimonioDeleteRes) {
          // Set message assertion
          (testimonioDeleteRes.body.message).should.match('User is not authorized');

          // Handle testimonio error error
          done(testimonioDeleteErr);
        });

    });
  });

  it('should be able to get a single testimonio that has an orphaned user reference', function (done) {
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

          // Save a new testimonio
          agent.post('/api/testimonios')
            .send(testimonio)
            .expect(200)
            .end(function (testimonioSaveErr, testimonioSaveRes) {
              // Handle testimonio save error
              if (testimonioSaveErr) {
                return done(testimonioSaveErr);
              }

              // Set assertions on new testimonio
              (testimonioSaveRes.body.title).should.equal(testimonio.title);
              should.exist(testimonioSaveRes.body.user);
              should.equal(testimonioSaveRes.body.user._id, orphanId);

              // force the testimonio to have an orphaned user reference
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

                    // Get the testimonio
                    agent.get('/api/testimonios/' + testimonioSaveRes.body._id)
                      .expect(200)
                      .end(function (testimonioInfoErr, testimonioInfoRes) {
                        // Handle testimonio error
                        if (testimonioInfoErr) {
                          return done(testimonioInfoErr);
                        }

                        // Set assertions
                        (testimonioInfoRes.body._id).should.equal(testimonioSaveRes.body._id);
                        (testimonioInfoRes.body.title).should.equal(testimonio.title);
                        should.equal(testimonioInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single testimonio if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new testimonio model instance
    testimonio.user = user;
    var testimonioObj = new Testimonio(testimonio);

    // Save the testimonio
    testimonioObj.save(function () {
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

          // Save a new testimonio
          agent.post('/api/testimonios')
            .send(testimonio)
            .expect(200)
            .end(function (testimonioSaveErr, testimonioSaveRes) {
              // Handle testimonio save error
              if (testimonioSaveErr) {
                return done(testimonioSaveErr);
              }

              // Get the testimonio
              agent.get('/api/testimonios/' + testimonioSaveRes.body._id)
                .expect(200)
                .end(function (testimonioInfoErr, testimonioInfoRes) {
                  // Handle testimonio error
                  if (testimonioInfoErr) {
                    return done(testimonioInfoErr);
                  }

                  // Set assertions
                  (testimonioInfoRes.body._id).should.equal(testimonioSaveRes.body._id);
                  (testimonioInfoRes.body.title).should.equal(testimonio.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (testimonioInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single testimonio if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new testimonio model instance
    var testimonioObj = new Testimonio(testimonio);

    // Save the testimonio
    testimonioObj.save(function () {
      request(app).get('/api/testimonios/' + testimonioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', testimonio.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single testimonio, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Testimonio
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

          // Save a new testimonio
          agent.post('/api/testimonios')
            .send(testimonio)
            .expect(200)
            .end(function (testimonioSaveErr, testimonioSaveRes) {
              // Handle testimonio save error
              if (testimonioSaveErr) {
                return done(testimonioSaveErr);
              }

              // Set assertions on new testimonio
              (testimonioSaveRes.body.title).should.equal(testimonio.title);
              should.exist(testimonioSaveRes.body.user);
              should.equal(testimonioSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the testimonio
                  agent.get('/api/testimonios/' + testimonioSaveRes.body._id)
                    .expect(200)
                    .end(function (testimonioInfoErr, testimonioInfoRes) {
                      // Handle testimonio error
                      if (testimonioInfoErr) {
                        return done(testimonioInfoErr);
                      }

                      // Set assertions
                      (testimonioInfoRes.body._id).should.equal(testimonioSaveRes.body._id);
                      (testimonioInfoRes.body.title).should.equal(testimonio.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (testimonioInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Testimonio.remove().exec(done);
    });
  });
});
