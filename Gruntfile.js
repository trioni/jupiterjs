/*global module:false*/
/**
 * Configuring tasks: http://gruntjs.com/configuring-tasks
 * Globbing patterns: http://gruntjs.com/configuring-tasks#globbing-patterns
 */
module.exports = function(grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    // Project configuration.
    grunt.initConfig({
        filenames: {
            style: 'style'
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed' // compact / expanded / nested / compressed
                },
                src: 'styles/sass/*.scss',
                dest: 'styles/css/<%= filenames.style %>.css'
            },
            dev: {
                options: {
                    style: 'compact'
                },
                src: 'styles/sass/*.scss',
                dest: 'styles/css/<%= filenames.style %>.css'
            }
        },
        files: {
            templates: [
                'src/packages/*/templates/*.html'
            ],
            styles: [
                'styles/sass/**/*.scss'
            ]
        },
        jstConfig: {
            prettify: true,
            amdWrapper: true,
            processName: function(filename) {
                return filename.split('/').pop().split('.').shift();
            }
        },
        jst: {
            overview: {
                options: '<%= jstConfig %>',
                files: {
                    'src/packages/overview/templates.js': ['src/packages/overview/templates/*.html']
                }
            },
            units: {
                options: '<%= jstConfig %>',
                files: {
                    'src/packages/units/templates.js': ['src/packages/units/templates/*.html']
                }
            }
        },
        watch: {
            styles: {
                files: ['<%= files.styles %>'],
                tasks: ['sass:dev']
            },
            templates: {
                files: ['<%= files.templates %>'],
                tasks: ['jst']
            }
        },
        requirejs: {
            /* Official example build file: https://github.com/jrburke/r.js/blob/master/build/example.build.js */
            modules: [
                {
                    name: 'Bootstrapper',
                    include: [
                        'requireLib',
                        'jquery',
                        'underscore',
                        'backbone',
                        'marionette',
                    ]
                },
                { name: 'packageloader', exclude: ['Bootstrapper'] },
                { name: 'test', exclude: ['Bootstrapper'] }
            ],
            /* Will build i master file inlcuding most libs, plugins and the bootstrapping + 1 package-file for each package */
            dev: {
                options: {
                    appDir: 'src/',
                    baseUrl: './',
                    mainConfigFile: 'src/config.js',
                    dir: 'dist/',
                    paths: {
                        'requireLib': './vendor/require/require'
                    },
                    optimize: 'none',
                    removeCombined: false,
                    preserveLicenseComments: true,
                    modules: '<%= requirejs.modules %>'
                }
            },
            /* Will build i master file inlcuding most libs, plugins and the bootstrapping + 1 package-file for each package */
            dist: {
                options: {
                    appDir: 'src/',
                    baseUrl: './',
                    mainConfigFile: 'src/config.js',
                    dir: 'dist/',
                    paths: {
                        'requireLib': './vendor/require/require'
                    },
                    removeCombined: true,
                    preserveLicenseComments: false,
                    modules: '<%= requirejs.modules %>'
                }
            },
            /* Will build 1 single file */
            single: {
                options: {
                    baseUrl: 'src/',
                    mainConfigFile: 'src/config.js',
                    optimize: 'none',
                    removeCombined: false,
                    preserveLicenseComments: true,
                    dir: 'dist/',
                    modules: [
                        { name: 'BulkBootstrapper' }
                    ]
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jst']);
};
