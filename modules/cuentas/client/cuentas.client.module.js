(function (app) {
  'use strict';

  app.registerModule('cuentas', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('cuentas.services');
  app.registerModule('cuentas.routes', ['ui.router', 'core.routes', 'cuentas.services']);
}(ApplicationConfiguration));
