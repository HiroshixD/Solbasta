'use strict';

/**
 * Module dependencies
 */
var remindersPolicy = require('../policies/reminders.server.policy'),
  reminders = require('../controllers/reminders.server.controller');

module.exports = function (app) {
  // Reminders collection routes
  app.route('/api/reminders').all(remindersPolicy.isAllowed)
    .get(reminders.list)
    .post(reminders.create);

  app.route('/api/reminder/:subasta/:user')
    .get(reminders.listForIds);

  // Single reminder routes
  app.route('/api/reminders/:reminderId').all(remindersPolicy.isAllowed)
    .get(reminders.read)
    .put(reminders.update)
    .delete(reminders.delete);

  app.route('/api/removereminder/:subasta/:user')
    .get(reminders.removeReminder);

  app.route('/api/remindersbyuser/:idusuario')
    .get(reminders.getRemindersByUser);

  app.route('/api/removereminderforid')
    .post(reminders.removeReminderById);

  // Finish by binding the reminder middleware
  app.param('reminderId', reminders.reminderByID);
};
