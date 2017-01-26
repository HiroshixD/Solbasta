(function (app) {
  'use strict';

  app.registerModule('transaccion_cuentas', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('transaccion_cuentas.services');
  app.registerModule('transaccion_cuentas.routes', ['ui.router', 'core.routes', 'transaccion_cuentas.services']);
}(ApplicationConfiguration));
