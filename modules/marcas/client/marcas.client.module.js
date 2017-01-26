(function (app) {
  'use strict';

  app.registerModule('marcas', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('marcas.services');
  app.registerModule('marcas.routes', ['ui.router', 'core.routes', 'marcas.services']);
}(ApplicationConfiguration));
