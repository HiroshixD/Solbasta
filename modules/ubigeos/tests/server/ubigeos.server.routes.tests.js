'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ubigeo = mongoose.model('Ubigeo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ubigeo;

/**
 * Ubigeo routes tests
 */
describe('Ubigeo CRUD tests', function () {

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

    // Save a user to the test db and create new ubigeo
    user.save(function () {
      ubigeo = {
        title: 'Ubigeo Title',
        content: 'Ubigeo Content'
      };

      done();
    });
  });

  it('should be able to save an ubigeo if logged in', function (done) {
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

        // Save a new ubigeo
        agent.post('/api/ubigeos')
          .send(ubigeo)
          .expect(200)
          .end(function (ubigeoSaveErr, ubigeoSaveRes) {
            // Handle ubigeo save error
            if (ubigeoSaveErr) {
              return done(ubigeoSaveErr);
            }

            // Get a list of ubigeos
            agent.get('/api/ubigeos')
              .end(function (ubigeosGetErr, ubigeosGetRes) {
                // Handle ubigeo save error
                if (ubigeosGetErr) {
                  return done(ubigeosGetErr);
                }

                // Get ubigeos list
                var ubigeos = ubigeosGetRes.body;

                // Set assertions
                (ubigeos[0].user._id).should.equal(userId);
                (ubigeos[0].title).should.match('Ubigeo Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an ubigeo if not logged in', function (done) {
    agent.post('/api/ubigeos')
      .send(ubigeo)
      .expect(403)
      .end(function (ubigeoSaveErr, ubigeoSaveRes) {
        // Call the assertion callback
        done(ubigeoSaveErr);
      });
  });

  it('should not be able to save an ubigeo if no title is provided', function (done) {
    // Invalidate title field
    ubigeo.title = '';

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

        // Save a new ubigeo
        agent.post('/api/ubigeos')
          .send(ubigeo)
          .expect(400)
          .end(function (ubigeoSaveErr, ubigeoSaveRes) {
            // Set message assertion
            (ubigeoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle ubigeo save error
            done(ubigeoSaveErr);
          });
      });
  });

  it('should be able to update an ubigeo if signed in', function (done) {
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

        // Save a new ubigeo
        agent.post('/api/ubigeos')
          .send(ubigeo)
          .expect(200)
          .end(function (ubigeoSaveErr, ubigeoSaveRes) {
            // Handle ubigeo save error
            if (ubigeoSaveErr) {
              return done(ubigeoSaveErr);
            }

            // Update ubigeo title
            ubigeo.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing ubigeo
            agent.put('/api/ubigeos/' + ubigeoSaveRes.body._id)
              .send(ubigeo)
              .expect(200)
              .end(function (ubigeoUpdateErr, ubigeoUpdateRes) {
                // Handle ubigeo update error
                if (ubigeoUpdateErr) {
                  return done(ubigeoUpdateErr);
                }

                // Set assertions
                (ubigeoUpdateRes.body._id).should.equal(ubigeoSaveRes.body._id);
                (ubigeoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of ubigeos if not signed in', function (done) {
    // Create new ubigeo model instance
    var ubigeoObj = new Ubigeo(ubigeo);

    // Save the ubigeo
    ubigeoObj.save(function () {
      // Request ubigeos
      request(app).get('/api/ubigeos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single ubigeo if not signed in', function (done) {
    // Create new ubigeo model instance
    var ubigeoObj = new Ubigeo(ubigeo);

    // Save the ubigeo
    ubigeoObj.save(function () {
      request(app).get('/api/ubigeos/' + ubigeoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', ubigeo.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single ubigeo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ubigeos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ubigeo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single ubigeo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent ubigeo
    request(app).get('/api/ubigeos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No ubigeo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an ubigeo if signed in', function (done) {
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

        // Save a new ubigeo
        agent.post('/api/ubigeos')
          .send(ubigeo)
          .expect(200)
          .end(function (ubigeoSaveErr, ubigeoSaveRes) {
            // Handle ubigeo save error
            if (ubigeoSaveErr) {
              return done(ubigeoSaveErr);
            }

            // Delete an existing ubigeo
            agent.delete('/api/ubigeos/' + ubigeoSaveRes.body._id)
              .send(ubigeo)
              .expect(200)
              .end(function (ubigeoDeleteErr, ubigeoDeleteRes) {
                // Handle ubigeo error error
                if (ubigeoDeleteErr) {
                  return done(ubigeoDeleteErr);
                }

                // Set assertions
                (ubigeoDeleteRes.body._id).should.equal(ubigeoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an ubigeo if not signed in', function (done) {
    // Set ubigeo user
    ubigeo.user = user;

    // Create new ubigeo model instance
    var ubigeoObj = new Ubigeo(ubigeo);

    // Save the ubigeo
    ubigeoObj.save(function () {
      // Try deleting ubigeo
      request(app).delete('/api/ubigeos/' + ubigeoObj._id)
        .expect(403)
        .end(function (ubigeoDeleteErr, ubigeoDeleteRes) {
          // Set message assertion
          (ubigeoDeleteRes.body.message).should.match('User is not authorized');

          // Handle ubigeo error error
          done(ubigeoDeleteErr);
        });

    });
  });

  it('should be able to get a single ubigeo that has an orphaned user reference', function (done) {
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

          // Save a new ubigeo
          agent.post('/api/ubigeos')
            .send(ubigeo)
            .expect(200)
            .end(function (ubigeoSaveErr, ubigeoSaveRes) {
              // Handle ubigeo save error
              if (ubigeoSaveErr) {
                return done(ubigeoSaveErr);
              }

              // Set assertions on new ubigeo
              (ubigeoSaveRes.body.title).should.equal(ubigeo.title);
              should.exist(ubigeoSaveRes.body.user);
              should.equal(ubigeoSaveRes.body.user._id, orphanId);

              // force the ubigeo to have an orphaned user reference
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

                    // Get the ubigeo
                    agent.get('/api/ubigeos/' + ubigeoSaveRes.body._id)
                      .expect(200)
                      .end(function (ubigeoInfoErr, ubigeoInfoRes) {
                        // Handle ubigeo error
                        if (ubigeoInfoErr) {
                          return done(ubigeoInfoErr);
                        }

                        // Set assertions
                        (ubigeoInfoRes.body._id).should.equal(ubigeoSaveRes.body._id);
                        (ubigeoInfoRes.body.title).should.equal(ubigeo.title);
                        should.equal(ubigeoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single ubigeo if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new ubigeo model instance
    ubigeo.user = user;
    var ubigeoObj = new Ubigeo(ubigeo);

    // Save the ubigeo
    ubigeoObj.save(function () {
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

          // Save a new ubigeo
          agent.post('/api/ubigeos')
            .send(ubigeo)
            .expect(200)
            .end(function (ubigeoSaveErr, ubigeoSaveRes) {
              // Handle ubigeo save error
              if (ubigeoSaveErr) {
                return done(ubigeoSaveErr);
              }

              // Get the ubigeo
              agent.get('/api/ubigeos/' + ubigeoSaveRes.body._id)
                .expect(200)
                .end(function (ubigeoInfoErr, ubigeoInfoRes) {
                  // Handle ubigeo error
                  if (ubigeoInfoErr) {
                    return done(ubigeoInfoErr);
                  }

                  // Set assertions
                  (ubigeoInfoRes.body._id).should.equal(ubigeoSaveRes.body._id);
                  (ubigeoInfoRes.body.title).should.equal(ubigeo.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (ubigeoInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single ubigeo if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new ubigeo model instance
    var ubigeoObj = new Ubigeo(ubigeo);

    // Save the ubigeo
    ubigeoObj.save(function () {
      request(app).get('/api/ubigeos/' + ubigeoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', ubigeo.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single ubigeo, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Ubigeo
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

          // Save a new ubigeo
          agent.post('/api/ubigeos')
            .send(ubigeo)
            .expect(200)
            .end(function (ubigeoSaveErr, ubigeoSaveRes) {
              // Handle ubigeo save error
              if (ubigeoSaveErr) {
                return done(ubigeoSaveErr);
              }

              // Set assertions on new ubigeo
              (ubigeoSaveRes.body.title).should.equal(ubigeo.title);
              should.exist(ubigeoSaveRes.body.user);
              should.equal(ubigeoSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the ubigeo
                  agent.get('/api/ubigeos/' + ubigeoSaveRes.body._id)
                    .expect(200)
                    .end(function (ubigeoInfoErr, ubigeoInfoRes) {
                      // Handle ubigeo error
                      if (ubigeoInfoErr) {
                        return done(ubigeoInfoErr);
                      }

                      // Set assertions
                      (ubigeoInfoRes.body._id).should.equal(ubigeoSaveRes.body._id);
                      (ubigeoInfoRes.body.title).should.equal(ubigeo.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (ubigeoInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Ubigeo.remove().exec(done);
    });
  });
});
