'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Producto = mongoose.model('Producto'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  producto;

/**
 * Producto routes tests
 */
describe('Producto CRUD tests', function () {

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

    // Save a user to the test db and create new producto
    user.save(function () {
      producto = {
        title: 'Producto Title',
        content: 'Producto Content'
      };

      done();
    });
  });

  it('should be able to save an producto if logged in', function (done) {
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

        // Save a new producto
        agent.post('/api/productos')
          .send(producto)
          .expect(200)
          .end(function (productoSaveErr, productoSaveRes) {
            // Handle producto save error
            if (productoSaveErr) {
              return done(productoSaveErr);
            }

            // Get a list of productos
            agent.get('/api/productos')
              .end(function (productosGetErr, productosGetRes) {
                // Handle producto save error
                if (productosGetErr) {
                  return done(productosGetErr);
                }

                // Get productos list
                var productos = productosGetRes.body;

                // Set assertions
                (productos[0].user._id).should.equal(userId);
                (productos[0].title).should.match('Producto Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an producto if not logged in', function (done) {
    agent.post('/api/productos')
      .send(producto)
      .expect(403)
      .end(function (productoSaveErr, productoSaveRes) {
        // Call the assertion callback
        done(productoSaveErr);
      });
  });

  it('should not be able to save an producto if no title is provided', function (done) {
    // Invalidate title field
    producto.title = '';

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

        // Save a new producto
        agent.post('/api/productos')
          .send(producto)
          .expect(400)
          .end(function (productoSaveErr, productoSaveRes) {
            // Set message assertion
            (productoSaveRes.body.message).should.match('Title cannot be blank');

            // Handle producto save error
            done(productoSaveErr);
          });
      });
  });

  it('should be able to update an producto if signed in', function (done) {
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

        // Save a new producto
        agent.post('/api/productos')
          .send(producto)
          .expect(200)
          .end(function (productoSaveErr, productoSaveRes) {
            // Handle producto save error
            if (productoSaveErr) {
              return done(productoSaveErr);
            }

            // Update producto title
            producto.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing producto
            agent.put('/api/productos/' + productoSaveRes.body._id)
              .send(producto)
              .expect(200)
              .end(function (productoUpdateErr, productoUpdateRes) {
                // Handle producto update error
                if (productoUpdateErr) {
                  return done(productoUpdateErr);
                }

                // Set assertions
                (productoUpdateRes.body._id).should.equal(productoSaveRes.body._id);
                (productoUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of productos if not signed in', function (done) {
    // Create new producto model instance
    var productoObj = new Producto(producto);

    // Save the producto
    productoObj.save(function () {
      // Request productos
      request(app).get('/api/productos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single producto if not signed in', function (done) {
    // Create new producto model instance
    var productoObj = new Producto(producto);

    // Save the producto
    productoObj.save(function () {
      request(app).get('/api/productos/' + productoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', producto.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single producto with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/productos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Producto is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single producto which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent producto
    request(app).get('/api/productos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No producto with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an producto if signed in', function (done) {
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

        // Save a new producto
        agent.post('/api/productos')
          .send(producto)
          .expect(200)
          .end(function (productoSaveErr, productoSaveRes) {
            // Handle producto save error
            if (productoSaveErr) {
              return done(productoSaveErr);
            }

            // Delete an existing producto
            agent.delete('/api/productos/' + productoSaveRes.body._id)
              .send(producto)
              .expect(200)
              .end(function (productoDeleteErr, productoDeleteRes) {
                // Handle producto error error
                if (productoDeleteErr) {
                  return done(productoDeleteErr);
                }

                // Set assertions
                (productoDeleteRes.body._id).should.equal(productoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an producto if not signed in', function (done) {
    // Set producto user
    producto.user = user;

    // Create new producto model instance
    var productoObj = new Producto(producto);

    // Save the producto
    productoObj.save(function () {
      // Try deleting producto
      request(app).delete('/api/productos/' + productoObj._id)
        .expect(403)
        .end(function (productoDeleteErr, productoDeleteRes) {
          // Set message assertion
          (productoDeleteRes.body.message).should.match('User is not authorized');

          // Handle producto error error
          done(productoDeleteErr);
        });

    });
  });

  it('should be able to get a single producto that has an orphaned user reference', function (done) {
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

          // Save a new producto
          agent.post('/api/productos')
            .send(producto)
            .expect(200)
            .end(function (productoSaveErr, productoSaveRes) {
              // Handle producto save error
              if (productoSaveErr) {
                return done(productoSaveErr);
              }

              // Set assertions on new producto
              (productoSaveRes.body.title).should.equal(producto.title);
              should.exist(productoSaveRes.body.user);
              should.equal(productoSaveRes.body.user._id, orphanId);

              // force the producto to have an orphaned user reference
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

                    // Get the producto
                    agent.get('/api/productos/' + productoSaveRes.body._id)
                      .expect(200)
                      .end(function (productoInfoErr, productoInfoRes) {
                        // Handle producto error
                        if (productoInfoErr) {
                          return done(productoInfoErr);
                        }

                        // Set assertions
                        (productoInfoRes.body._id).should.equal(productoSaveRes.body._id);
                        (productoInfoRes.body.title).should.equal(producto.title);
                        should.equal(productoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single producto if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new producto model instance
    producto.user = user;
    var productoObj = new Producto(producto);

    // Save the producto
    productoObj.save(function () {
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

          // Save a new producto
          agent.post('/api/productos')
            .send(producto)
            .expect(200)
            .end(function (productoSaveErr, productoSaveRes) {
              // Handle producto save error
              if (productoSaveErr) {
                return done(productoSaveErr);
              }

              // Get the producto
              agent.get('/api/productos/' + productoSaveRes.body._id)
                .expect(200)
                .end(function (productoInfoErr, productoInfoRes) {
                  // Handle producto error
                  if (productoInfoErr) {
                    return done(productoInfoErr);
                  }

                  // Set assertions
                  (productoInfoRes.body._id).should.equal(productoSaveRes.body._id);
                  (productoInfoRes.body.title).should.equal(producto.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (productoInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single producto if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new producto model instance
    var productoObj = new Producto(producto);

    // Save the producto
    productoObj.save(function () {
      request(app).get('/api/productos/' + productoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', producto.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single producto, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Producto
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

          // Save a new producto
          agent.post('/api/productos')
            .send(producto)
            .expect(200)
            .end(function (productoSaveErr, productoSaveRes) {
              // Handle producto save error
              if (productoSaveErr) {
                return done(productoSaveErr);
              }

              // Set assertions on new producto
              (productoSaveRes.body.title).should.equal(producto.title);
              should.exist(productoSaveRes.body.user);
              should.equal(productoSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the producto
                  agent.get('/api/productos/' + productoSaveRes.body._id)
                    .expect(200)
                    .end(function (productoInfoErr, productoInfoRes) {
                      // Handle producto error
                      if (productoInfoErr) {
                        return done(productoInfoErr);
                      }

                      // Set assertions
                      (productoInfoRes.body._id).should.equal(productoSaveRes.body._id);
                      (productoInfoRes.body.title).should.equal(producto.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (productoInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Producto.remove().exec(done);
    });
  });
});
