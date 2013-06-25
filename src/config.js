/*global define, require */
define([], function() {
    'use strict';
    return require.config({
        // Map commonly used libraries to their file location
        paths: {
            jquery: 'vendor/jquery/1.9.1/jquery',
            underscore: 'vendor/underscore/1.4.4/underscore',
            backbone: 'vendor/backbone/1.0.0/backbone',
            marionette: 'vendor/backbone/marionette/1.0.2/backbone.marionette',
            app: 'app/App',
            router: 'app/Router'
        },

        packages: [
            { name: 'packageloader', location: 'packages/packageloader' },
            { name: 'test', location: 'packages/test' },
        ],

        // The shim section is used to load scripts that doesn't support AMD
        // and make sure their dependencies is loaded before executing the defined script.
        shim: {
            'jquery': {
                exports: '$'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'underscore': {
                exports: '_'
            },
            'marionette': ['backbone','jquery']
        }
    });
});
