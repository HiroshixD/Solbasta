'use strict';

/**
 * Module dependencies
 */
var productosPolicy = require('../policies/productos.server.policy'),
  productos = require('../controllers/productos.server.controller');

module.exports = function (app) {
  // Productos collection routes
  app.route('/api/productos').all(productosPolicy.isAllowed)
    .get(productos.list)
    .post(productos.create);

  // Single producto routes
  app.route('/api/productos/:productoId').all(productosPolicy.isAllowed)
    .get(productos.read)
    .put(productos.update)
    .delete(productos.delete);

  app.route('/api/getsliders')
    .get(productos.listSliders);

  app.route('/api/producto/thumbnail_1/:productoId')
    .post(productos.updateThumbnail_1);

  app.route('/api/producto/thumbnail_2/:productoId')
    .post(productos.updateThumbnail_2);

  app.route('/api/producto/thumbnail_3/:productoId')
    .post(productos.updateThumbnail_3);

  app.route('/api/producto/imagenurl/:productoId')
    .post(productos.updateImagenUrl);

  app.route('/api/producto/thumbnail_1_mobil/:productoId')
    .post(productos.updateThumbnail_1_mobil);

  app.route('/api/producto/thumbnail_2_mobil/:productoId')
    .post(productos.updateThumbnail_2_mobil);

  app.route('/api/producto/thumbnail_3_mobil/:productoId')
    .post(productos.updateThumbnail_3_mobil);

  app.route('/api/producto/imagenurl_mobil/:productoId')
    .post(productos.updateImagenUrl_mobil);

  // Finish by binding the producto middleware
  app.param('productoId', productos.productoByID);
};
