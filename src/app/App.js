/*global define */
define([
    'backbone',
    'router',
    'marionette',
    'extensions/StringExtensions'
], function (Backbone, Router) {
    'use strict';
    var App = new Backbone.Marionette.Application();

    App.router = new Router();

    App.on('start', function () {
        Backbone.history.start();
    });

    window.App = App;
    return App;
});
