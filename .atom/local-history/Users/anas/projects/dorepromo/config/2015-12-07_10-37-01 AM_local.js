module.exports = {
		ssl: {
			ca: require('fs').readFileSync(__dirname + '/ssl/server.crt'),
			key: require('fs').readFileSync(__dirname + '/ssl/server.key'),
			cert: require('fs').readFileSync(__dirname + '/ssl/server.crt')
		},

		port: process.env.PORT || 1337,

		environment: process.env.NODE_ENV || 'development',

		googleAuth: {
			clientID: '412303073361-5p19r3s794utvsgp26n20ut0jm7cmvob.apps.googleusercontent.com',
			clientSecret: '7pY3_TGUuEnPlXW4DLGB27Ov'
		},

		socialIds: {
			facebook: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
			},
			twitter: {
				consumerKey: 'get_your_own',
				consumerSecret: 'get_your_own',
				callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
			},
			github: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: "http://127.0.0.1:1337/auth/github/callback"
			},
			google: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: 'http://127.0.0.1:1337/auth/google/callback'
			},
			instagram: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: 'http://127.0.0.1:1337/auth/instagram/callback'
			}


		};