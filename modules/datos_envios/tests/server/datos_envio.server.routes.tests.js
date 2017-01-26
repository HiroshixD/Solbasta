'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Datos_envio = mongoose.model('Datos_envio'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  datos_envio;

/**
 * Datos_envio routes tests
 */
describe('Datos_envio CRUD tests', function () {

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

    // Save a user to the test db and create new datos_envio
    user.save(function () {
      datos_envio = {
        title: 'Datos_envio Title',
        content: 'Datos_envio Content'
      };

      done();
    });
  });

  it('should be able to save an datos_envio if logged in', function (done) {
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

        // Save a new datos_envio
        agent.post('/api/datos_envios')
          .send(datos_envio)
          .expect(200)
          .end(function (datos_envioSaveErr, datos_envioSaveRes) {
            // Handle datos_envio save error
            if (datos_envioSaveErr) {
              return done(datos_envioSaveErr);
            }

            // Get a list of datos_envios
            agent.get('/api/datos_envios')
              .end(function (datos_enviosGetErr, datos_enviosGetRes) {
                // Handle datos_envio save error
                if (datos_enviosGetErr) {
                  return done(datos_enviosGetErr);
                }

                // Get datos_envios list
                var datos_envios = datos_enviosGetRes.body;

                // Set assertions
                (datos_envios[0].user._id).should.equal(userId);
                (datos_envios[0].title).should.match('Datos_envio Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an datos_envio if not logged in', function (done) {
    agent.post('/api/datos_envios')
      .send(datos_envio)
      .expect(403)
      .end(function (datos_envioSaveErr, datos_envioSaveRes) {
        // Call the assertion callback
        done(datos_envioSaveErr);
      });
  });

  it('should not be able to save an datos_envio if no title is provided', function (done) {
    // Invalidate title field
    datos_envio.title = '';

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

        // Save a new datos_envio
        agent.post('/api/datos_envios')
          .send(datos_envio)
          .expect(400)
          .end(function (datos_envioSaveErr, datos_envioSaveRes) {
            // Set message assertion
            (datos_envioSaveRes.body.message).should.match('Title cannot be blank');

            // Handle datos_envio save error
            done(datos_envioSaveErr);
          });
      });
  });

  it('should be able to update an datos_envio if signed in', function (done) {
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

        // Save a new datos_envio
        agent.post('/api/datos_envios')
          .send(datos_envio)
          .expect(200)
          .end(function (datos_envioSaveErr, datos_envioSaveRes) {
            // Handle datos_envio save error
            if (datos_envioSaveErr) {
              return done(datos_envioSaveErr);
            }

            // Update datos_envio title
            datos_envio.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing datos_envio
            agent.put('/api/datos_envios/' + datos_envioSaveRes.body._id)
              .send(datos_envio)
              .expect(200)
              .end(function (datos_envioUpdateErr, datos_envioUpdateRes) {
                // Handle datos_envio update error
                if (datos_envioUpdateErr) {
                  return done(datos_envioUpdateErr);
                }

                // Set assertions
                (datos_envioUpdateRes.body._id).should.equal(datos_envioSaveRes.body._id);
                (datos_envioUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of datos_envios if not signed in', function (done) {
    // Create new datos_envio model instance
    var datos_envioObj = new Datos_envio(datos_envio);

    // Save the datos_envio
    datos_envioObj.save(function () {
      // Request datos_envios
      request(app).get('/api/datos_envios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single datos_envio if not signed in', function (done) {
    // Create new datos_envio model instance
    var datos_envioObj = new Datos_envio(datos_envio);

    // Save the datos_envio
    datos_envioObj.save(function () {
      request(app).get('/api/datos_envios/' + datos_envioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', datos_envio.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single datos_envio with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/datos_envios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Datos_envio is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single datos_envio which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent datos_envio
    request(app).get('/api/datos_envios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No datos_envio with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an datos_envio if signed in', function (done) {
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

        // Save a new datos_envio
        agent.post('/api/datos_envios')
          .send(datos_envio)
          .expect(200)
          .end(function (datos_envioSaveErr, datos_envioSaveRes) {
            // Handle datos_envio save error
            if (datos_envioSaveErr) {
              return done(datos_envioSaveErr);
            }

            // Delete an existing datos_envio
            agent.delete('/api/datos_envios/' + datos_envioSaveRes.body._id)
              .send(datos_envio)
              .expect(200)
              .end(function (datos_envioDeleteErr, datos_envioDeleteRes) {
                // Handle datos_envio error error
                if (datos_envioDeleteErr) {
                  return done(datos_envioDeleteErr);
                }

                // Set assertions
                (datos_envioDeleteRes.body._id).should.equal(datos_envioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an datos_envio if not signed in', function (done) {
    // Set datos_envio user
    datos_envio.user = user;

    // Create new datos_envio model instance
    var datos_envioObj = new Datos_envio(datos_envio);

    // Save the datos_envio
    datos_envioObj.save(function () {
      // Try deleting datos_envio
      request(app).delete('/api/datos_envios/' + datos_envioObj._id)
        .expect(403)
        .end(function (datos_envioDeleteErr, datos_envioDeleteRes) {
          // Set message assertion
          (datos_envioDeleteRes.body.message).should.match('User is not authorized');

          // Handle datos_envio error error
          done(datos_envioDeleteErr);
        });

    });
  });

  it('should be able to get a single datos_envio that has an orphaned user reference', function (done) {
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

          // Save a new datos_envio
          agent.post('/api/datos_envios')
            .send(datos_envio)
            .expect(200)
            .end(function (datos_envioSaveErr, datos_envioSaveRes) {
              // Handle datos_envio save error
              if (datos_envioSaveErr) {
                return done(datos_envioSaveErr);
              }

              // Set assertions on new datos_envio
              (datos_envioSaveRes.body.title).should.equal(datos_envio.title);
              should.exist(datos_envioSaveRes.body.user);
              should.equal(datos_envioSaveRes.body.user._id, orphanId);

              // force the datos_envio to have an orphaned user reference
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

                    // Get the datos_envio
                    agent.get('/api/datos_envios/' + datos_envioSaveRes.body._id)
                      .expect(200)
                      .end(function (datos_envioInfoErr, datos_envioInfoRes) {
                        // Handle datos_envio error
                        if (datos_envioInfoErr) {
                          return done(datos_envioInfoErr);
                        }

                        // Set assertions
                        (datos_envioInfoRes.body._id).should.equal(datos_envioSaveRes.body._id);
                        (datos_envioInfoRes.body.title).should.equal(datos_envio.title);
                        should.equal(datos_envioInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single datos_envio if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new datos_envio model instance
    datos_envio.user = user;
    var datos_envioObj = new Datos_envio(datos_envio);

    // Save the datos_envio
    datos_envioObj.save(function () {
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

          // Save a new datos_envio
          agent.post('/api/datos_envios')
            .send(datos_envio)
            .expect(200)
            .end(function (datos_envioSaveErr, datos_envioSaveRes) {
              // Handle datos_envio save error
              if (datos_envioSaveErr) {
                return done(datos_envioSaveErr);
              }

              // Get the datos_envio
              agent.get('/api/datos_envios/' + datos_envioSaveRes.body._id)
                .expect(200)
                .end(function (datos_envioInfoErr, datos_envioInfoRes) {
                  // Handle datos_envio error
                  if (datos_envioInfoErr) {
                    return done(datos_envioInfoErr);
                  }

                  // Set assertions
                  (datos_envioInfoRes.body._id).should.equal(datos_envioSaveRes.body._id);
                  (datos_envioInfoRes.body.title).should.equal(datos_envio.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (datos_envioInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single datos_envio if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new datos_envio model instance
    var datos_envioObj = new Datos_envio(datos_envio);

    // Save the datos_envio
    datos_envioObj.save(function () {
      request(app).get('/api/datos_envios/' + datos_envioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', datos_envio.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single datos_envio, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Datos_envio
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

          // Save a new datos_envio
          agent.post('/api/datos_envios')
            .send(datos_envio)
            .expect(200)
            .end(function (datos_envioSaveErr, datos_envioSaveRes) {
              // Handle datos_envio save error
              if (datos_envioSaveErr) {
                return done(datos_envioSaveErr);
              }

              // Set assertions on new datos_envio
              (datos_envioSaveRes.body.title).should.equal(datos_envio.title);
              should.exist(datos_envioSaveRes.body.user);
              should.equal(datos_envioSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the datos_envio
                  agent.get('/api/datos_envios/' + datos_envioSaveRes.body._id)
                    .expect(200)
                    .end(function (datos_envioInfoErr, datos_envioInfoRes) {
                      // Handle datos_envio error
                      if (datos_envioInfoErr) {
                        return done(datos_envioInfoErr);
                      }

                      // Set assertions
                      (datos_envioInfoRes.body._id).should.equal(datos_envioSaveRes.body._id);
                      (datos_envioInfoRes.body.title).should.equal(datos_envio.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (datos_envioInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Datos_envio.remove().exec(done);
    });
  });
});
