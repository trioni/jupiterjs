/*global define */
define([
    './PlaceServiceApi'
], function( PlaceServiceApi ) {
    'use strict';
    var apiConfig = {
        user: '',
        pass: '',
        protocol: 'http://',
        host: 'api.stockholm.se',
        service: 'PlaceService',
        apikey: 'a21275549ef44585806ea82a97e54c8a'
    };
    var Search = {
        initialize: function() {
            console.log('SearchPackage initialized!');
        },
        api: new PlaceServiceApi( apiConfig )
    };
    window.s = Search;
    return Search;
});