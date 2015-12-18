module.exports = function(grunt) {
	'use strict';
	grunt.config.set('watch', {
		assets: {

			// Assets to watch:
			files: ['assets/**/*', 'tasks/pipeline.js', '!**/node_modules/**'],

			// When assets are changed:
			tasks: ['syncAssets' , 'linkAssets']
		},

		scripts: {

    files: 'api/**/*.js',		
    options: {
      interrupt: true,
			reload: true
    },
  },
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};
