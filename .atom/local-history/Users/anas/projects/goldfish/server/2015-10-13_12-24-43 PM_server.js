
Meteor.startup(function () {
  // code to run on server at startup
  if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
      username: 'admin',
      password: '123456',
      profile: {
        firstName: 'the amazing',
        lastName: 'bla bla'
      }
    });
  }

});
