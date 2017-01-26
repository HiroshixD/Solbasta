(function (app) {
  'use strict';

  app.registerModule('paquetes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('paquetes.services');
  app.registerModule('paquetes.routes', ['ui.router', 'core.routes', 'paquetes.services']);
}(ApplicationConfiguration));
