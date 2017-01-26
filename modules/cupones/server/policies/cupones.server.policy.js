'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Cupones Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/cupones',
      permissions: '*'
    }, {
      resources: '/api/cupones/:cuponId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/cupones',
      permissions: ['post']
    }, {
      resources: '/api/cupones/:cuponId',
      permissions: ['get', 'put']
    }, {
      resources: '/api/cupon/:codigo',
      permissions: ['get', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/cupones',
      permissions: ['get']
    }, {
      resources: '/api/cupones/:cuponId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Cupones Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an cupon is being processed and the current user created it then allow any manipulation
  if (req.cupon && req.user && req.cupon.user && req.cupon.user.id === req.user.id) {
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
