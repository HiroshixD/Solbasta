(function (app) {
  'use strict';

  app.registerModule('commons', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('commons.services');
}(ApplicationConfiguration));
