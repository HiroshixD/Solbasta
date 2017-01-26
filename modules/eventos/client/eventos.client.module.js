(function (app) {
  'use strict';

  app.registerModule('eventos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('eventos.services');
  app.registerModule('eventos.routes', ['ui.router', 'core.routes', 'eventos.services']);
}(ApplicationConfiguration));
