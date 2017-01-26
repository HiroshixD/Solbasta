(function (app) {
  'use strict';

  app.registerModule('homes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('homes.services');
  app.registerModule('homes.routes', ['ui.router', 'core.routes', 'homes.services']);
}(ApplicationConfiguration));
