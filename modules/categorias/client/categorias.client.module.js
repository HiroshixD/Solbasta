(function (app) {
  'use strict';

  app.registerModule('categorias', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('categorias.services');
  app.registerModule('categorias.routes', ['ui.router', 'core.routes', 'categorias.services']);
}(ApplicationConfiguration));
