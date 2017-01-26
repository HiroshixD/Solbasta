'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Transaccion_cuentas Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/transaccion_cuentas',
      permissions: '*'
    }, {
      resources: '/api/transaccion_cuentas/:transaccion_cuentaId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/transaccion_cuentas',
      permissions: ['get', 'post']
    }, {
      resources: '/api/transaccion_cuentas/:transaccion_cuentaId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/transaccion_cuentas',
      permissions: ['get']
    }, {
      resources: '/api/transaccion_cuentas/:transaccion_cuentaId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Transaccion_cuentas Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an transaccion_cuenta is being processed and the current user created it then allow any manipulation
  if (req.transaccion_cuenta && req.user && req.transaccion_cuenta.user && req.transaccion_cuenta.user.id === req.user.id) {
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
          message: 'User is not authorized'
        });
      }
    }
  });
};
