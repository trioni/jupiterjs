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
                    style: 'compressed'
                },
                src: 'styles/sass/*.scss',
                dest: 'styles/css/<%= filenames.style %>.css'
            },
            dev: {
                options: {
                    style: 'compact'
                },
                src: 'styles/sass/*.scss',
                dest: 'styles/css/<%= filename.style %>.css'
            }
        },
        files: {
            templates: [
                'src/packages/*/templates/*.html'
            ],
            styles: [
                'styles/sass/*.scss'
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
            compile: {
                options: {
                    appDir: 'src/',
                    baseUrl: './',
                    mainConfigFile: 'web-src/config.js',
                    dir: 'dist/',
                    paths: {
                        'jquery': './vendor/jquery/1.9.1/jquery',
                        'requireLib': './vendor/require/require',
                    },
                    removeCombined: false,
                    preserveLicenseComments: true,
                    // Excluding Marionette will also exclude all of it's dependencies: Backbone, Underscore, jQuery. Unless excludeShallow
                    modules: [
                        {
                            name: 'Bootstrapper',
                            include: [
                                'requireLib',
                                'jquery',
                                'underscore',
                                'backbone',
                                'marionette',
                                'pubsub'
                            ]
                        },
                        { name: 'packageloader', exclude: ['marionette'] },
                        {
                            name: 'labels',
                            exclude: [
                                'querystring',
                                'entities'
                            ]
                        },
                        { name: 'facets', exclude: ['marionette','text'] },
                        {
                            name: 'empty',
                            exclude: [
                                'text',
                                'marionette',
                                'params',
                                'querystring',
                                'labels',
                                'app'
                            ]
                        },
                        { name: 'master', exclude: ['marionette'] },
                        { name: 'entities', exclude: ['marionette'] },
                        { name: 'resultlist', exclude: ['marionette'] },
                        { name: 'searchbox', exclude: ['marionette'] },
                        { name: 'filter', exclude: ['marionette','labels'] },
                        {
                            name: 'querystring',
                            exclude: [
                                'marionette',
                                'params'
                            ]
                        },
                        {
                            name: 'pushes',
                            exclude: [
                                'marionette',
                                'labels',
                                'entities',
                                'pubsub'
                            ]
                        },
                        {
                            name: 'news',
                            exclude: [
                                'marionette',
                                'labels',
                                'entities',
                                'pubsub'
                            ]
                        },
                        { name: 'mixins', exclude: ['marionette'] },
                        {
                            name: 'framework',
                            exclude: [
                                'marionette',
                                'labels',
                                'pubsub',
                                'animatedanchor'
                            ]
                        },
                        {
                            name: 'content',
                            exclude: [
                                'marionette',
                                'framework/Page',
                                'pubsub',
                                'scrollspy',
                                'animatedanchor'
                            ]
                        }
                    ]
                }

            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jst']);
};
