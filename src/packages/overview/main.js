/*global define */
define([
    'jquery',
    'app',
    'search',
    'backbone',
    './OverviewListView',
    'marionette'
], function( $, App, Search, Backbone, OverviewListView ) {
    'use strict';
    var Overview = {
        initialize: function() {
            console.log('Overview package initialized');
            // Add a route to listen for
            App.router.route('overview','overview', function() {
                console.log('Overview route triggered!');
            });

            // Add a region that targets list-region
            App.addRegions({ listRegion: '#list-region' });
            App.listRegion.show( Overview.initView() );
            window.location.hash = 'overview';
        },
        initView: function() {
            return new OverviewListView();
        }
    };
    return Overview;
});