/*global define */
define([
    'jquery',
    'backbone',
    'app',
    'search',
    './UnitListView'
], function( $, Backbone, App, Search, UnitListView ) {
    'use strict';
    var Units = {
        initialize: function() {
            App.vent.on('category:selected', $.proxy(Units.onCategorySelected, Units));
            Units.units = new Backbone.Collection();

            // Register region
            App.addRegions({
                resultRegion: '#result-region'
            });
        },
        onCategorySelected: function( categoryModel ) {
            // 1. Clear region
            // 2. Create view
            // 3. load data
            console.log('Selected', categoryModel);
            var foo = new UnitListView({
                model: new Backbone.Model( categoryModel ),
                collection: this.units
            });
            App.resultRegion.show( foo );
            var endpoint = Search.api.getUnitsByCategoryId( categoryModel.Id );
            this.units.fetch({
                url: endpoint,
                success: function() {
                    console.log('Units loaded', arguments);
                }
            });
        }
    };
    return Units;
});