/*global
    define
*/
define([
    'backbone'
], function (Backbone) {
    'use strict';

    var Router = Backbone.Router.extend({
        routes: {
            'help': 'help'
        },
        help: function() {
            console.log('help route triggered!');
        }
    });
    return Router;
});