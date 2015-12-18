module.exports.policies = {
  //   '*': [
  //   'basicAuth',
  //   'passport',
  //   'sessionAuth',
  //   'ModelPolicy',
  //   'AuditPolicy',
  //   'OwnerPolicy',
  //   'PermissionPolicy',
  //   'RolePolicy',
  //   'CriteriaPolicy'
  // ],
  // 
  '*': true,
  
  AuthController: {
  '*': ['passport']
}
};
