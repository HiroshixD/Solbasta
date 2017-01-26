(function (app) {
  'use strict';

  app.registerModule('datos_envios', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('datos_envios.services');
  app.registerModule('datos_envios.routes', ['ui.router', 'core.routes', 'datos_envios.services']);
}(ApplicationConfiguration));
