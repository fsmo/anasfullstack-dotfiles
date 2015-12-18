module.exports.policies = {
	'*': true,
	AudienceListController: {
		'*': [
        // Initialize Passport
        passport.initialize(),

        // Use Passport's built-in sessions
        passport.session(),
				'isAuthenticated'
    ]
	}
};
