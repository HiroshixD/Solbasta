(function (app) {
  'use strict';

  app.registerModule('transaccions', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('transaccions.services');
  app.registerModule('transaccions.routes', ['ui.router', 'core.routes', 'transaccions.services']);
}(ApplicationConfiguration));
