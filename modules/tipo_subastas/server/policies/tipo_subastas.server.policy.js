'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Tipo_subastas Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/tipo_subastas',
      permissions: '*'
    }, {
      resources: '/api/tipo_subastas/:tipo_subastaId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/tipo_subastas',
      permissions: ['get', 'post']
    }, {
      resources: '/api/tipo_subastas/:tipo_subastaId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/tipo_subastas',
      permissions: ['get']
    }, {
      resources: '/api/tipo_subastas/:tipo_subastaId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Tipo_subastas Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an tipo_subasta is being processed and the current user created it then allow any manipulation
  if (req.tipo_subasta && req.user && req.tipo_subasta.user && req.tipo_subasta.user.id === req.user.id) {
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
