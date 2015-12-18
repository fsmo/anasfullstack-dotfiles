module.exports.http = {
	middleware: {
		order: [
		'startRequestTimer',
		'cookieParser',
		'session',
		'passportInit',
		'passportSession',
		'myRequestLogger',
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
		},

		bodyParser: require('skipper')

	},

	cache: 31557600000
};
