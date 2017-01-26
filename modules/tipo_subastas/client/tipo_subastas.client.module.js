(function (app) {
  'use strict';

  app.registerModule('tipo_subastas', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tipo_subastas.services');
  app.registerModule('tipo_subastas.routes', ['ui.router', 'core.routes', 'tipo_subastas.services']);
}(ApplicationConfiguration));
