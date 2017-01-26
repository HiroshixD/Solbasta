'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Datos_envios Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/datos_envios',
      permissions: '*'
    }, {
      resources: '/api/datos_envios/:datos_envioId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/datos_envios',
      permissions: ['get', 'post']
    }, {
      resources: '/api/datos_envios/:datos_envioId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/datos_envios',
      permissions: ['get']
    }, {
      resources: '/api/datos_envios/:datos_envioId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Datos_envios Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an datos_envio is being processed and the current user created it then allow any manipulation
  if (req.datos_envio && req.user && req.datos_envio.user && req.datos_envio.user.id === req.user.id) {
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
