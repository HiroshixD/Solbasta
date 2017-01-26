(function (app) {
  'use strict';

  app.registerModule('testimonios', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('testimonios.services');
  app.registerModule('testimonios.routes', ['ui.router', 'core.routes', 'testimonios.services']);
}(ApplicationConfiguration));
