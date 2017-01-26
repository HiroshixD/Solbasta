'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Transaccion_saldos Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/transaccion_saldos',
      permissions: '*'
    }, {
      resources: '/api/transaccion_saldos/:transaccion_saldoId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/transaccion_saldos',
      permissions: ['get', 'post']
    }, {
      resources: '/api/transaccion_saldos/:transaccion_saldoId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/transaccion_saldos',
      permissions: ['get']
    }, {
      resources: '/api/transaccion_saldos/:transaccion_saldoId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Transaccion_saldos Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an transaccion_saldo is being processed and the current user created it then allow any manipulation
  if (req.transaccion_saldo && req.user && req.transaccion_saldo.user && req.transaccion_saldo.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'Usuario no autorizado'
        });
      }
    }
  });
};
