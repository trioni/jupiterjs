/*global define */
define([
    'backbone',
    './templates',
    'extensions/ListClassHelper',
    'app'
], function( Backbone, templates, ListClassHelper, App ) {
    'use strict';
    var viewDefinition = {
        tagName: 'article',
        className: function() {
            var classes = 'category',
                index = this.model.collection.indexOf(this.model);
            if( index === 0 ) {
                classes = classes.concat(' first');
            }
            return classes;
        },
        template: templates.categoryitem,
        events: {
            'click a': 'clickHandler'
        },
        ui: {
            anchor: 'a'
        },
        clickHandler: function( e ) {
            e.preventDefault();
            App.vent.trigger('category:selected', this.model.toJSON());
        }
    };
    var CategoryItemView = Backbone.Marionette.ItemView.extend( viewDefinition );
    return CategoryItemView;
});
