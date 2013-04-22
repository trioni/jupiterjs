/*global define */
define([
    'underscore'
], function( _ ) {
    'use strict';
    var ServiceApi = function( config ) {
        this.settings = _.extend({
            user: null,
            pass: null,
            protocol: null,
            host: null,
            service: null,
            apikey: null
        }, config);

        if ( ServiceApi.prototype._singletonInstance ) {
            return ServiceApi.prototype._singletonInstance;
        }
        ServiceApi.prototype._singletonInstance = this;
    };

    ServiceApi.prototype = {
        getEndpoint: function(segment, params) {
            var endPoint = [];
            endPoint.push(this.settings.protocol);

            this._addCredentialsToEndpoint( endPoint );
            this._appendServiceRootToEndpoint( endPoint );

            if (segment !== null && typeof(segment) === 'string') {
                if( !segment.startsWith('/') ) {
                    segment = '/'.concat(segment);
                }
                endPoint.push(segment);
            }

            this._setFormatToEndpoint( endPoint, 'json');
            this._appendApiKeyToEndpoint( endPoint, this.settings.apikey );

            if (params !== null) {
                endPoint.push(params);
            }
            return endPoint.join('').concat('&callback=?');
        },
        _addCredentialsToEndpoint: function( endPoint ) {
            if ( !_.isEmpty(this.settings.user) && !_.isEmpty(this.settings.pass)) {
                endPoint.push(this.settings.user, ':', this.settings.pass, '@');
            }
        },
        _appendServiceRootToEndpoint: function( endPoint ) {
            endPoint.push(this.settings.host, '/', this.settings.service);
        },
        _setFormatToEndpoint: function( endPoint, format ) {
            endPoint.push('/' + format);
        },
        _appendApiKeyToEndpoint: function( endPoint, apiKey ) {
            endPoint.push('?apikey=', apiKey);
        },
        getServiceUnitById : function( id ) {
            var segment = _.template('/DetailedServiceUnits/<%= id %>', {id:id});
            return this.getEndpoint(segment);
        },
        getServiceUnitsByIds : function(ids) {
            if (!_.isArray(ids)) {
                throw 'Parameter \'ids\' is not an array.';
            }

            ids = ids.join(',');
            var segment = '/DetailedServiceUnits',
                params = _.template('&ids=<%= ids %>', {ids:ids});

            return this.getEndpoint(segment, params);
        },
        getServiceUnitsByTypeId : function(id) {
            var segment = _.template('/ServiceUnitTypes/<%= id %>/DetailedServiceUnits', {id:id});
            return this.getEndpoint(segment);
        },
        getServiceUnitAttributesById : function(id) {
            var segment = _.template('/ServiceUnits/<%= id %>/Attributes', {id:id});
            return this.getEndpoint(segment);
        },
        getFileById : function(id) {
            var segment = _.template('/Files/<%= id %>', {id:id});
            return this.getEndpoint(segment);
        },
        getServiceUnitsByTypeIdAndLocation : function(id, latitude, longitude) {
            var segment = _.template('/ServiceUnitTypes/<%= id %>/DetailedServiceUnits', {id:id}),
                params = _.template('&geographicalposition=<%= locX %>,<%= locY %>&sortby=distancetogeographicalposition', {locX:latitude, locY:longitude});
            return this.getEndpoint(segment, params);
        },
        explore: function() {
            return this.getEndpoint();
        },
        getGroups: function() {
            return this.getEndpoint('ServiceUnitTypeGroups');
        },
        getUnitsByCategoryId: function( id ) {
            var segment = _.template('/ServiceUnitTypeGroups/<%= id %>/ServiceUnits', {id:id});
            return this.getEndpoint(segment);
        }
    };
    return ServiceApi;
});