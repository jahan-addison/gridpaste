'use strict';

var request = require('request'),
    shim    = require('browserify-shim');
 
module.exports = function (grunt) { 
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35728, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          './app/javascripts/dist/main.min.js': ['./app/javascripts/dist/build.js']
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'app/css',
          cssDir: 'app/css/build'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          './app/css/build/main.min.css': ['./app/css/build/main.css']
        }
      }
    },
    browserify2: {
      compile: {
        entry: './app/javascripts/main.js',
        compile: './app/javascripts/dist/build.js',
        beforeHook: function(bundle) {
          shim(bundle, {
            Mousetrap: {
              path: './app/components/mousetrap/mousetrap.min',
              exports: 'Mousetrap'
            },
            RxJS: {
              path: './app/components/rxjs/rx.lite,js',
              exports: 'Rx'              
            }
          });
        }
      }
    },
    mochaTest: {
      test: {
        options: {
        },
        src: ['test/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        logLevel: 'ERROR'
      }
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
          'routes/*.js',
          'views/**/*.html'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['routes/*.js', 'app/javascripts/**/*.js', './Gruntfile.js'],
        options: {
          livereload: reloadPort
        }
      },
      sass: {
        files: ['app/css/**/*.scss'],
        tasks: ['compass'],
        options: {
          livereload: reloadPort
        }
      },
      browserify: {
        files: ['app/javascripts/**/*.js'],
        tasks: ['browserify2:compile'],
        options: {
          livereload: reloadPort
        }
      },
      karma: {
        files: ['app/javascripts/**/*.js', 'browser_test/*.js'],
        tasks: ['karma'],
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


  grunt.registerTask('test', "Application wide test run", function() {
    console.log('********************************************************************\nApplication Spec:');
//    grunt.task.run('mochaTest');
    grunt.task.run('karma');

  });

  grunt.registerTask('deploy', ['compass', 'browserify2:compile', 'cssmin', 'uglify']);
  grunt.registerTask('default', ['develop', 'compass', 'browserify2:compile', 'watch']);
};
