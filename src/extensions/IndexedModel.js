/*global define */
define([
    'backbone'
], function( Backbone ) {
    'use strict';
    var IndexedModel = Backbone.Model.extend({
        initialize: function() {
            if( this.collection ) {
                var index = this.collection.indexOf( this );
                this.set('Index', index);
                console.log(this.attributes);
            }
        }
    });
    return IndexedModel;
});
