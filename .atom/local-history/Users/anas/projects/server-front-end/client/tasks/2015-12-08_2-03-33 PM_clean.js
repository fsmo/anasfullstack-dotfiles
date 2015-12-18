
module.exports = function (grunt) {
	grunt.config.set('clean', {
		docs: {
			src: [ './ts-doc-build', './docs' ]
		},

		dev: {
			src: [ './ts-build' ]
		},

		preProduction: {
			src: [ './tmp', '../bachjs-dist/*', '!../bachjs-dist/.git*' ],
			options: {
				force: true
			}
		},

		postProduction: {
			src: [ './tmp' ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
};
