'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Categoria = mongoose.model('Categoria'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  categoria;

/**
 * Categoria routes tests
 */
describe('Categoria CRUD tests', function () {

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

    // Save a user to the test db and create new categoria
    user.save(function () {
      categoria = {
        title: 'Categoria Title',
        content: 'Categoria Content'
      };

      done();
    });
  });

  it('should be able to save an categoria if logged in', function (done) {
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

        // Save a new categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(200)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Handle categoria save error
            if (categoriaSaveErr) {
              return done(categoriaSaveErr);
            }

            // Get a list of categorias
            agent.get('/api/categorias')
              .end(function (categoriasGetErr, categoriasGetRes) {
                // Handle categoria save error
                if (categoriasGetErr) {
                  return done(categoriasGetErr);
                }

                // Get categorias list
                var categorias = categoriasGetRes.body;

                // Set assertions
                (categorias[0].user._id).should.equal(userId);
                (categorias[0].title).should.match('Categoria Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an categoria if not logged in', function (done) {
    agent.post('/api/categorias')
      .send(categoria)
      .expect(403)
      .end(function (categoriaSaveErr, categoriaSaveRes) {
        // Call the assertion callback
        done(categoriaSaveErr);
      });
  });

  it('should not be able to save an categoria if no title is provided', function (done) {
    // Invalidate title field
    categoria.title = '';

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

        // Save a new categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(400)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Set message assertion
            (categoriaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle categoria save error
            done(categoriaSaveErr);
          });
      });
  });

  it('should be able to update an categoria if signed in', function (done) {
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

        // Save a new categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(200)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Handle categoria save error
            if (categoriaSaveErr) {
              return done(categoriaSaveErr);
            }

            // Update categoria title
            categoria.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing categoria
            agent.put('/api/categorias/' + categoriaSaveRes.body._id)
              .send(categoria)
              .expect(200)
              .end(function (categoriaUpdateErr, categoriaUpdateRes) {
                // Handle categoria update error
                if (categoriaUpdateErr) {
                  return done(categoriaUpdateErr);
                }

                // Set assertions
                (categoriaUpdateRes.body._id).should.equal(categoriaSaveRes.body._id);
                (categoriaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of categorias if not signed in', function (done) {
    // Create new categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the categoria
    categoriaObj.save(function () {
      // Request categorias
      request(app).get('/api/categorias')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single categoria if not signed in', function (done) {
    // Create new categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the categoria
    categoriaObj.save(function () {
      request(app).get('/api/categorias/' + categoriaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', categoria.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single categoria with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/categorias/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Categoria is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single categoria which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent categoria
    request(app).get('/api/categorias/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No categoria with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an categoria if signed in', function (done) {
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

        // Save a new categoria
        agent.post('/api/categorias')
          .send(categoria)
          .expect(200)
          .end(function (categoriaSaveErr, categoriaSaveRes) {
            // Handle categoria save error
            if (categoriaSaveErr) {
              return done(categoriaSaveErr);
            }

            // Delete an existing categoria
            agent.delete('/api/categorias/' + categoriaSaveRes.body._id)
              .send(categoria)
              .expect(200)
              .end(function (categoriaDeleteErr, categoriaDeleteRes) {
                // Handle categoria error error
                if (categoriaDeleteErr) {
                  return done(categoriaDeleteErr);
                }

                // Set assertions
                (categoriaDeleteRes.body._id).should.equal(categoriaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an categoria if not signed in', function (done) {
    // Set categoria user
    categoria.user = user;

    // Create new categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the categoria
    categoriaObj.save(function () {
      // Try deleting categoria
      request(app).delete('/api/categorias/' + categoriaObj._id)
        .expect(403)
        .end(function (categoriaDeleteErr, categoriaDeleteRes) {
          // Set message assertion
          (categoriaDeleteRes.body.message).should.match('User is not authorized');

          // Handle categoria error error
          done(categoriaDeleteErr);
        });

    });
  });

  it('should be able to get a single categoria that has an orphaned user reference', function (done) {
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

          // Save a new categoria
          agent.post('/api/categorias')
            .send(categoria)
            .expect(200)
            .end(function (categoriaSaveErr, categoriaSaveRes) {
              // Handle categoria save error
              if (categoriaSaveErr) {
                return done(categoriaSaveErr);
              }

              // Set assertions on new categoria
              (categoriaSaveRes.body.title).should.equal(categoria.title);
              should.exist(categoriaSaveRes.body.user);
              should.equal(categoriaSaveRes.body.user._id, orphanId);

              // force the categoria to have an orphaned user reference
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

                    // Get the categoria
                    agent.get('/api/categorias/' + categoriaSaveRes.body._id)
                      .expect(200)
                      .end(function (categoriaInfoErr, categoriaInfoRes) {
                        // Handle categoria error
                        if (categoriaInfoErr) {
                          return done(categoriaInfoErr);
                        }

                        // Set assertions
                        (categoriaInfoRes.body._id).should.equal(categoriaSaveRes.body._id);
                        (categoriaInfoRes.body.title).should.equal(categoria.title);
                        should.equal(categoriaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single categoria if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new categoria model instance
    categoria.user = user;
    var categoriaObj = new Categoria(categoria);

    // Save the categoria
    categoriaObj.save(function () {
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

          // Save a new categoria
          agent.post('/api/categorias')
            .send(categoria)
            .expect(200)
            .end(function (categoriaSaveErr, categoriaSaveRes) {
              // Handle categoria save error
              if (categoriaSaveErr) {
                return done(categoriaSaveErr);
              }

              // Get the categoria
              agent.get('/api/categorias/' + categoriaSaveRes.body._id)
                .expect(200)
                .end(function (categoriaInfoErr, categoriaInfoRes) {
                  // Handle categoria error
                  if (categoriaInfoErr) {
                    return done(categoriaInfoErr);
                  }

                  // Set assertions
                  (categoriaInfoRes.body._id).should.equal(categoriaSaveRes.body._id);
                  (categoriaInfoRes.body.title).should.equal(categoria.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (categoriaInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single categoria if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new categoria model instance
    var categoriaObj = new Categoria(categoria);

    // Save the categoria
    categoriaObj.save(function () {
      request(app).get('/api/categorias/' + categoriaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', categoria.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single categoria, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Categoria
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

          // Save a new categoria
          agent.post('/api/categorias')
            .send(categoria)
            .expect(200)
            .end(function (categoriaSaveErr, categoriaSaveRes) {
              // Handle categoria save error
              if (categoriaSaveErr) {
                return done(categoriaSaveErr);
              }

              // Set assertions on new categoria
              (categoriaSaveRes.body.title).should.equal(categoria.title);
              should.exist(categoriaSaveRes.body.user);
              should.equal(categoriaSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the categoria
                  agent.get('/api/categorias/' + categoriaSaveRes.body._id)
                    .expect(200)
                    .end(function (categoriaInfoErr, categoriaInfoRes) {
                      // Handle categoria error
                      if (categoriaInfoErr) {
                        return done(categoriaInfoErr);
                      }

                      // Set assertions
                      (categoriaInfoRes.body._id).should.equal(categoriaSaveRes.body._id);
                      (categoriaInfoRes.body.title).should.equal(categoria.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (categoriaInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Categoria.remove().exec(done);
    });
  });
});
