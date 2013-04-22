/*global define */
define([
    'underscore',
    'backbone',
    './templates',
    'marionette'
], function( _, Backbone, templates ) {
    'use strict';

    var UnitView = Backbone.Marionette.ItemView.extend({
        template: templates.unititem
    });

    var UnitListView = Backbone.Marionette.CompositeView.extend({
        className: 'l-container',
        template: _.template('<h2><%= Name %></h2>'),
        itemView: UnitView,
        initialize: function() {
            console.log('m', this.model);
        }
    });
    return UnitListView;
});