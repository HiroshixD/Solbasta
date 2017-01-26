'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Marca = mongoose.model('Marca'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  marca;

/**
 * Marca routes tests
 */
describe('Marca CRUD tests', function () {

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

    // Save a user to the test db and create new marca
    user.save(function () {
      marca = {
        title: 'Marca Title',
        content: 'Marca Content'
      };

      done();
    });
  });

  it('should be able to save an marca if logged in', function (done) {
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

        // Save a new marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(200)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Handle marca save error
            if (marcaSaveErr) {
              return done(marcaSaveErr);
            }

            // Get a list of marcas
            agent.get('/api/marcas')
              .end(function (marcasGetErr, marcasGetRes) {
                // Handle marca save error
                if (marcasGetErr) {
                  return done(marcasGetErr);
                }

                // Get marcas list
                var marcas = marcasGetRes.body;

                // Set assertions
                (marcas[0].user._id).should.equal(userId);
                (marcas[0].title).should.match('Marca Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an marca if not logged in', function (done) {
    agent.post('/api/marcas')
      .send(marca)
      .expect(403)
      .end(function (marcaSaveErr, marcaSaveRes) {
        // Call the assertion callback
        done(marcaSaveErr);
      });
  });

  it('should not be able to save an marca if no title is provided', function (done) {
    // Invalidate title field
    marca.title = '';

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

        // Save a new marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(400)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Set message assertion
            (marcaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle marca save error
            done(marcaSaveErr);
          });
      });
  });

  it('should be able to update an marca if signed in', function (done) {
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

        // Save a new marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(200)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Handle marca save error
            if (marcaSaveErr) {
              return done(marcaSaveErr);
            }

            // Update marca title
            marca.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing marca
            agent.put('/api/marcas/' + marcaSaveRes.body._id)
              .send(marca)
              .expect(200)
              .end(function (marcaUpdateErr, marcaUpdateRes) {
                // Handle marca update error
                if (marcaUpdateErr) {
                  return done(marcaUpdateErr);
                }

                // Set assertions
                (marcaUpdateRes.body._id).should.equal(marcaSaveRes.body._id);
                (marcaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of marcas if not signed in', function (done) {
    // Create new marca model instance
    var marcaObj = new Marca(marca);

    // Save the marca
    marcaObj.save(function () {
      // Request marcas
      request(app).get('/api/marcas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single marca if not signed in', function (done) {
    // Create new marca model instance
    var marcaObj = new Marca(marca);

    // Save the marca
    marcaObj.save(function () {
      request(app).get('/api/marcas/' + marcaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', marca.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single marca with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/marcas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Marca is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single marca which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent marca
    request(app).get('/api/marcas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No marca with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an marca if signed in', function (done) {
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

        // Save a new marca
        agent.post('/api/marcas')
          .send(marca)
          .expect(200)
          .end(function (marcaSaveErr, marcaSaveRes) {
            // Handle marca save error
            if (marcaSaveErr) {
              return done(marcaSaveErr);
            }

            // Delete an existing marca
            agent.delete('/api/marcas/' + marcaSaveRes.body._id)
              .send(marca)
              .expect(200)
              .end(function (marcaDeleteErr, marcaDeleteRes) {
                // Handle marca error error
                if (marcaDeleteErr) {
                  return done(marcaDeleteErr);
                }

                // Set assertions
                (marcaDeleteRes.body._id).should.equal(marcaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an marca if not signed in', function (done) {
    // Set marca user
    marca.user = user;

    // Create new marca model instance
    var marcaObj = new Marca(marca);

    // Save the marca
    marcaObj.save(function () {
      // Try deleting marca
      request(app).delete('/api/marcas/' + marcaObj._id)
        .expect(403)
        .end(function (marcaDeleteErr, marcaDeleteRes) {
          // Set message assertion
          (marcaDeleteRes.body.message).should.match('User is not authorized');

          // Handle marca error error
          done(marcaDeleteErr);
        });

    });
  });

  it('should be able to get a single marca that has an orphaned user reference', function (done) {
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

          // Save a new marca
          agent.post('/api/marcas')
            .send(marca)
            .expect(200)
            .end(function (marcaSaveErr, marcaSaveRes) {
              // Handle marca save error
              if (marcaSaveErr) {
                return done(marcaSaveErr);
              }

              // Set assertions on new marca
              (marcaSaveRes.body.title).should.equal(marca.title);
              should.exist(marcaSaveRes.body.user);
              should.equal(marcaSaveRes.body.user._id, orphanId);

              // force the marca to have an orphaned user reference
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

                    // Get the marca
                    agent.get('/api/marcas/' + marcaSaveRes.body._id)
                      .expect(200)
                      .end(function (marcaInfoErr, marcaInfoRes) {
                        // Handle marca error
                        if (marcaInfoErr) {
                          return done(marcaInfoErr);
                        }

                        // Set assertions
                        (marcaInfoRes.body._id).should.equal(marcaSaveRes.body._id);
                        (marcaInfoRes.body.title).should.equal(marca.title);
                        should.equal(marcaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single marca if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new marca model instance
    marca.user = user;
    var marcaObj = new Marca(marca);

    // Save the marca
    marcaObj.save(function () {
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

          // Save a new marca
          agent.post('/api/marcas')
            .send(marca)
            .expect(200)
            .end(function (marcaSaveErr, marcaSaveRes) {
              // Handle marca save error
              if (marcaSaveErr) {
                return done(marcaSaveErr);
              }

              // Get the marca
              agent.get('/api/marcas/' + marcaSaveRes.body._id)
                .expect(200)
                .end(function (marcaInfoErr, marcaInfoRes) {
                  // Handle marca error
                  if (marcaInfoErr) {
                    return done(marcaInfoErr);
                  }

                  // Set assertions
                  (marcaInfoRes.body._id).should.equal(marcaSaveRes.body._id);
                  (marcaInfoRes.body.title).should.equal(marca.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (marcaInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single marca if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new marca model instance
    var marcaObj = new Marca(marca);

    // Save the marca
    marcaObj.save(function () {
      request(app).get('/api/marcas/' + marcaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', marca.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single marca, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Marca
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

          // Save a new marca
          agent.post('/api/marcas')
            .send(marca)
            .expect(200)
            .end(function (marcaSaveErr, marcaSaveRes) {
              // Handle marca save error
              if (marcaSaveErr) {
                return done(marcaSaveErr);
              }

              // Set assertions on new marca
              (marcaSaveRes.body.title).should.equal(marca.title);
              should.exist(marcaSaveRes.body.user);
              should.equal(marcaSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the marca
                  agent.get('/api/marcas/' + marcaSaveRes.body._id)
                    .expect(200)
                    .end(function (marcaInfoErr, marcaInfoRes) {
                      // Handle marca error
                      if (marcaInfoErr) {
                        return done(marcaInfoErr);
                      }

                      // Set assertions
                      (marcaInfoRes.body._id).should.equal(marcaSaveRes.body._id);
                      (marcaInfoRes.body.title).should.equal(marca.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (marcaInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Marca.remove().exec(done);
    });
  });
});
