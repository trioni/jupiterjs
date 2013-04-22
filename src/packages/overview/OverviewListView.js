/*global define */
define([
    'backbone',
    'search',
    './CategoryItemView',
    './templates',
    'extensions/IndexedCollection',
    'marionette'
], function( Backbone, Search, CategoryItemView, templates, IndexedCollection ) {
    'use strict';

    var viewDefinition = {
        className: 'overview l-container',
        template: templates.overviewlist,
        itemView: CategoryItemView,
        initialize: function() {
            this.collection = new IndexedCollection();
            this.collection.fetch({
                url: Search.api.getGroups()
            });
            this.model = new Backbone.Model({
                Title: 'Översikt'
            });

        }
    };
    var OverviewListView = Backbone.Marionette.CompositeView.extend( viewDefinition );
    return OverviewListView;
});
