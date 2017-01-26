(function (app) {
  'use strict';

  app.registerModule('compartidos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('compartidos.services');
  app.registerModule('compartidos.routes', ['ui.router', 'core.routes', 'compartidos.services']);
}(ApplicationConfiguration));
