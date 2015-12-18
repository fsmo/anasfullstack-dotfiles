
Meteor.startup(function () {
  // code to run on server at startup
  if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
      username: 'jsmith',
      password: 'password',
      profile: {
        firstName: 'John',
        lastName: 'Smith'
      }
    });
  }
  
});
