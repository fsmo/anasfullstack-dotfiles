module.exports = {
		ssl: {
			ca: require('fs').readFileSync(__dirname + '/ssl/server.crt'),
			key: require('fs').readFileSync(__dirname + '/ssl/server.key'),
			cert: require('fs').readFileSync(__dirname + '/ssl/server.crt')
		},

		port: process.env.PORT || 1337,

		environment: process.env.NODE_ENV || 'development',

		socialIds: {
			facebook: {
				clientID: '1691653437712832',
				clientSecret: '9788c31fb307b47cc9a10da2c0b7ffbf',
				callbackURL: 'https://127.0.0.1:1337/auth/facebook/callbackRemove'
			},
			twitter: {
				consumerKey: 'get_your_own',
				consumerSecret: 'get_your_own',
				callbackURL: "https://127.0.0.1:1337/auth/twitter/callback"
			},
			github: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: "http://127.0.0.1:1337/auth/github/callback"
			},
			google: {
				clientID: '100263881852-t2p142dodk8dc753ge9e375qs8t6rkdh.apps.googleusercontent.com',
				clientSecret: 'fCWz2f8nLgRLXmCcmCQbMCg7',
				callbackURL: 'http://127.0.0.1:1337/auth/google/callback'
			},
			instagram: {
				clientID: '355e09c24f294d5382956c792faded08',
				clientSecret: '28e3c62179c0419d9774fdbf651b39b1',
				callbackURL: 'https://127.0.0.1:1337/auth/instagram/callback'
			}
		};


{"web":{"client_id":"100263881852-t2p142dodk8dc753ge9e375qs8t6rkdh.apps.googleusercontent.com","project_id":"anasfullstacksocialauth","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"fCWz2f8nLgRLXmCcmCQbMCg7","redirect_uris":["https://127.0.0.1:1337/auth/google/callback"],"javascript_origins":["https://127.0.0.1:1337"]}}