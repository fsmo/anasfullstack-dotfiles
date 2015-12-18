var passport = require('passport');

module.exports.policies = {
  '*': [
  'basicAuth',
  'passport',
  'sessionAuth',
  'ModelPolicy',
  'AuditPolicy',
  'OwnerPolicy',
  'PermissionPolicy',
  'RolePolicy',
  'CriteriaPolicy'
],

  AuthController: {
  '*': ['passport']
}
};
