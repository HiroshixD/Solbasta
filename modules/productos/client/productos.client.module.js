(function (app) {
  'use strict';

  app.registerModule('productos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('productos.services');
  app.registerModule('productos.routes', ['ui.router', 'core.routes', 'productos.services']);
}(ApplicationConfiguration));
