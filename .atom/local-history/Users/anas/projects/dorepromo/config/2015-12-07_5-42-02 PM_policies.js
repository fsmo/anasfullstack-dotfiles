module.exports.policies = {
	'*': true,
	AudienceListController: {
		'*':'isAuthenticated'
	}
};
