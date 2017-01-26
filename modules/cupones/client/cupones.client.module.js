(function (app) {
  'use strict';

  app.registerModule('cupones', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('cupones.services');
  app.registerModule('cupones.routes', ['ui.router', 'core.routes', 'cupones.services']);
}(ApplicationConfiguration));
