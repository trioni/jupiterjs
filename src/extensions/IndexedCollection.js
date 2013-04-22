/*global define */
define([
    'backbone',
    './BaseModel'
], function( Backbone, BaseModel ) {
    'use strict';
    var IndexedCollection = Backbone.Collection.extend({
        model: BaseModel
    });
    return IndexedCollection;
});
