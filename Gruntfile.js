module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    babel: {
      options: {
        sourceMaps: false
      },
      dist: {
        files: [
          {
            expand: true,
            src: "client/*.js",
            dest: "dist/",
            ext: ".js"
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default', ['babel']);
};
