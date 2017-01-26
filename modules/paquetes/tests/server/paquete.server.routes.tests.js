'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Paquete = mongoose.model('Paquete'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  paquete;

/**
 * Paquete routes tests
 */
describe('Paquete CRUD tests', function () {

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

    // Save a user to the test db and create new paquete
    user.save(function () {
      paquete = {
        title: 'Paquete Title',
        content: 'Paquete Content'
      };

      done();
    });
  });

  it('should be able to save an paquete if logged in', function (done) {
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

        // Save a new paquete
        agent.post('/api/paquetes')
          .send(paquete)
          .expect(200)
          .end(function (paqueteSaveErr, paqueteSaveRes) {
            // Handle paquete save error
            if (paqueteSaveErr) {
              return done(paqueteSaveErr);
            }

            // Get a list of paquetes
            agent.get('/api/paquetes')
              .end(function (paquetesGetErr, paquetesGetRes) {
                // Handle paquete save error
                if (paquetesGetErr) {
                  return done(paquetesGetErr);
                }

                // Get paquetes list
                var paquetes = paquetesGetRes.body;

                // Set assertions
                (paquetes[0].user._id).should.equal(userId);
                (paquetes[0].title).should.match('Paquete Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an paquete if not logged in', function (done) {
    agent.post('/api/paquetes')
      .send(paquete)
      .expect(403)
      .end(function (paqueteSaveErr, paqueteSaveRes) {
        // Call the assertion callback
        done(paqueteSaveErr);
      });
  });

  it('should not be able to save an paquete if no title is provided', function (done) {
    // Invalidate title field
    paquete.title = '';

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

        // Save a new paquete
        agent.post('/api/paquetes')
          .send(paquete)
          .expect(400)
          .end(function (paqueteSaveErr, paqueteSaveRes) {
            // Set message assertion
            (paqueteSaveRes.body.message).should.match('Title cannot be blank');

            // Handle paquete save error
            done(paqueteSaveErr);
          });
      });
  });

  it('should be able to update an paquete if signed in', function (done) {
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

        // Save a new paquete
        agent.post('/api/paquetes')
          .send(paquete)
          .expect(200)
          .end(function (paqueteSaveErr, paqueteSaveRes) {
            // Handle paquete save error
            if (paqueteSaveErr) {
              return done(paqueteSaveErr);
            }

            // Update paquete title
            paquete.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing paquete
            agent.put('/api/paquetes/' + paqueteSaveRes.body._id)
              .send(paquete)
              .expect(200)
              .end(function (paqueteUpdateErr, paqueteUpdateRes) {
                // Handle paquete update error
                if (paqueteUpdateErr) {
                  return done(paqueteUpdateErr);
                }

                // Set assertions
                (paqueteUpdateRes.body._id).should.equal(paqueteSaveRes.body._id);
                (paqueteUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of paquetes if not signed in', function (done) {
    // Create new paquete model instance
    var paqueteObj = new Paquete(paquete);

    // Save the paquete
    paqueteObj.save(function () {
      // Request paquetes
      request(app).get('/api/paquetes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single paquete if not signed in', function (done) {
    // Create new paquete model instance
    var paqueteObj = new Paquete(paquete);

    // Save the paquete
    paqueteObj.save(function () {
      request(app).get('/api/paquetes/' + paqueteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', paquete.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single paquete with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/paquetes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Paquete is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single paquete which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent paquete
    request(app).get('/api/paquetes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No paquete with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an paquete if signed in', function (done) {
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

        // Save a new paquete
        agent.post('/api/paquetes')
          .send(paquete)
          .expect(200)
          .end(function (paqueteSaveErr, paqueteSaveRes) {
            // Handle paquete save error
            if (paqueteSaveErr) {
              return done(paqueteSaveErr);
            }

            // Delete an existing paquete
            agent.delete('/api/paquetes/' + paqueteSaveRes.body._id)
              .send(paquete)
              .expect(200)
              .end(function (paqueteDeleteErr, paqueteDeleteRes) {
                // Handle paquete error error
                if (paqueteDeleteErr) {
                  return done(paqueteDeleteErr);
                }

                // Set assertions
                (paqueteDeleteRes.body._id).should.equal(paqueteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an paquete if not signed in', function (done) {
    // Set paquete user
    paquete.user = user;

    // Create new paquete model instance
    var paqueteObj = new Paquete(paquete);

    // Save the paquete
    paqueteObj.save(function () {
      // Try deleting paquete
      request(app).delete('/api/paquetes/' + paqueteObj._id)
        .expect(403)
        .end(function (paqueteDeleteErr, paqueteDeleteRes) {
          // Set message assertion
          (paqueteDeleteRes.body.message).should.match('User is not authorized');

          // Handle paquete error error
          done(paqueteDeleteErr);
        });

    });
  });

  it('should be able to get a single paquete that has an orphaned user reference', function (done) {
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

          // Save a new paquete
          agent.post('/api/paquetes')
            .send(paquete)
            .expect(200)
            .end(function (paqueteSaveErr, paqueteSaveRes) {
              // Handle paquete save error
              if (paqueteSaveErr) {
                return done(paqueteSaveErr);
              }

              // Set assertions on new paquete
              (paqueteSaveRes.body.title).should.equal(paquete.title);
              should.exist(paqueteSaveRes.body.user);
              should.equal(paqueteSaveRes.body.user._id, orphanId);

              // force the paquete to have an orphaned user reference
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

                    // Get the paquete
                    agent.get('/api/paquetes/' + paqueteSaveRes.body._id)
                      .expect(200)
                      .end(function (paqueteInfoErr, paqueteInfoRes) {
                        // Handle paquete error
                        if (paqueteInfoErr) {
                          return done(paqueteInfoErr);
                        }

                        // Set assertions
                        (paqueteInfoRes.body._id).should.equal(paqueteSaveRes.body._id);
                        (paqueteInfoRes.body.title).should.equal(paquete.title);
                        should.equal(paqueteInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single paquete if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new paquete model instance
    paquete.user = user;
    var paqueteObj = new Paquete(paquete);

    // Save the paquete
    paqueteObj.save(function () {
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

          // Save a new paquete
          agent.post('/api/paquetes')
            .send(paquete)
            .expect(200)
            .end(function (paqueteSaveErr, paqueteSaveRes) {
              // Handle paquete save error
              if (paqueteSaveErr) {
                return done(paqueteSaveErr);
              }

              // Get the paquete
              agent.get('/api/paquetes/' + paqueteSaveRes.body._id)
                .expect(200)
                .end(function (paqueteInfoErr, paqueteInfoRes) {
                  // Handle paquete error
                  if (paqueteInfoErr) {
                    return done(paqueteInfoErr);
                  }

                  // Set assertions
                  (paqueteInfoRes.body._id).should.equal(paqueteSaveRes.body._id);
                  (paqueteInfoRes.body.title).should.equal(paquete.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (paqueteInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single paquete if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new paquete model instance
    var paqueteObj = new Paquete(paquete);

    // Save the paquete
    paqueteObj.save(function () {
      request(app).get('/api/paquetes/' + paqueteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', paquete.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single paquete, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Paquete
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

          // Save a new paquete
          agent.post('/api/paquetes')
            .send(paquete)
            .expect(200)
            .end(function (paqueteSaveErr, paqueteSaveRes) {
              // Handle paquete save error
              if (paqueteSaveErr) {
                return done(paqueteSaveErr);
              }

              // Set assertions on new paquete
              (paqueteSaveRes.body.title).should.equal(paquete.title);
              should.exist(paqueteSaveRes.body.user);
              should.equal(paqueteSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the paquete
                  agent.get('/api/paquetes/' + paqueteSaveRes.body._id)
                    .expect(200)
                    .end(function (paqueteInfoErr, paqueteInfoRes) {
                      // Handle paquete error
                      if (paqueteInfoErr) {
                        return done(paqueteInfoErr);
                      }

                      // Set assertions
                      (paqueteInfoRes.body._id).should.equal(paqueteSaveRes.body._id);
                      (paqueteInfoRes.body.title).should.equal(paquete.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (paqueteInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Paquete.remove().exec(done);
    });
  });
});
