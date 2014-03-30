'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          sassDir: 'public/css',
          cssDir: 'public/css/build'
        }
      }
    },
    browserify: {
      libs: {
        options: {
          shim: {
            jsxgraph: {
              path: 'public/js/external/jsxgraph.js',
              exports: 'JSXGraph'
            }
          }
        },
        src: ['public/js/main.js'],
        dest: 'public/js/build.js'
      },
    },
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      sass: {
        files: ['public/css/**/*.scss'],
        tasks: ['compass'],
        options: {
          livereload: reloadPort
        }
      },
      browserify: {
        files: ['public/js/*.js'],
        tasks: ['browserify'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/*.html'],
        options: {
          livereload: reloadPort
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['develop', 'compass', 'browserify', 'watch']);
};
