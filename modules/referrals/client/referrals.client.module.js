(function (app) {
  'use strict';

  app.registerModule('referrals', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('referrals.services');
  app.registerModule('referrals.routes', ['ui.router', 'core.routes', 'referrals.services']);
}(ApplicationConfiguration));
