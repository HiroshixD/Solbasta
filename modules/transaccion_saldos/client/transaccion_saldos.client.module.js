(function (app) {
  'use strict';

  app.registerModule('transaccion_saldos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('transaccion_saldos.services');
  app.registerModule('transaccion_saldos.routes', ['ui.router', 'core.routes', 'transaccion_saldos.services']);
}(ApplicationConfiguration));
