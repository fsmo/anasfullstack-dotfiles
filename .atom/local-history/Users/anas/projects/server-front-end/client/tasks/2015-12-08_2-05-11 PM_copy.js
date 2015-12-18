
module.exports = function (grunt) {
	grunt.config.set('copy', {
		templates: {
			src: 'templates/**',
			dest: 'tmp/'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
