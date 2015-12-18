module.exports.policies = {
	'*': true,
	AudienceListController: {
		'*': s'isAuthenticated'
	}
};
