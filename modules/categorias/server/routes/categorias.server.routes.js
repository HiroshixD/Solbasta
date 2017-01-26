'use strict';

/**
 * Module dependencies
 */
var categoriasPolicy = require('../policies/categorias.server.policy'),
  categorias = require('../controllers/categorias.server.controller');

module.exports = function (app) {
  // Categorias collection routes
  app.route('/api/categorias').all(categoriasPolicy.isAllowed)
    .get(categorias.list)
    .post(categorias.create);

  // Single categoria routes
  app.route('/api/categorias/:categoriaId').all(categoriasPolicy.isAllowed)
    .get(categorias.read)
    .put(categorias.update)
    .delete(categorias.delete);

  app.route('/api/categoria/image')
    .post(categorias.uploadCategoryImage);

  // Finish by binding the categoria middleware
  app.param('categoriaId', categorias.categoriaByID);
};
