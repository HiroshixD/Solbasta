(function (app) {
  'use strict';

  app.registerModule('ubigeos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('ubigeos.services');
  app.registerModule('ubigeos.routes', ['ui.router', 'core.routes', 'ubigeos.services']);
}(ApplicationConfiguration));
