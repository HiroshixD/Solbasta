(function (app) {
  'use strict';

  app.registerModule('reminders', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('reminders.services');
  app.registerModule('reminders.routes', ['ui.router', 'core.routes', 'reminders.services']);
}(ApplicationConfiguration));
