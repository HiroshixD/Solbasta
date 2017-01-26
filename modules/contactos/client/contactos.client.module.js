(function (app) {
  'use strict';

  app.registerModule('contactos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('contactos.services');
  app.registerModule('contactos.routes', ['ui.router', 'core.routes', 'contactos.services']);
}(ApplicationConfiguration));
