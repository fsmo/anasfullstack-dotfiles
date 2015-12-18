module.exports.http = {
	passportInit: require('passport').initialize(),
	passportSession: require('passport').session(),

	middleware: {
		order: [
		'startRequestTimer',
		'cookieParser',
		'passportInit',
		'passportSession',
		'myRequestLogger',
		'session',
		'bodyParser',
		'handleBodyParserError',
		'compress',
		'methodOverride',
		'poweredBy',
		'$custom',
		'router',
		'www',
		'favicon',
		'404',
		'500'
		],

		myRequestLogger: function (req, res, next) {
			'use strict';
			sails.log.info('Requested :: ', req.method, req.url);
			return next();
		}

		// bodyParser: require('skipper')

	},

	cache: 31557600000
};
