(function (app) {
  'use strict';

  app.registerModule('detalle_subastas', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('detalle_subastas.services');
  app.registerModule('detalle_subastas.routes', ['ui.router', 'core.routes', 'detalle_subastas.services']);
}(ApplicationConfiguration));
