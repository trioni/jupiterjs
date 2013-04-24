/*global define */
define([
    'underscore',
    'backbone'
], function( _, Backbone ) {
    'use strict';
    /* Create a BaseModel to allow computed attributes. Like ListIndex */
    var BaseModel = Backbone.Model.extend({
        defaults: {
            ListIndex: function() {
                return this.collection.indexOf(this);
            },
            ListTotal: function() {
                return this.collection.length;
            }
        },
        get: function(attr) {
            var value = Backbone.Model.prototype.get.call(this, attr);
            return _.isFunction(value) ? value.call(this) : value;
        },
        toJSON: function() {
            var data = {};
            var json = Backbone.Model.prototype.toJSON.call(this);
            _.each(json, function(value, key) {
                data[key] = this.get(key);
            }, this);
            return data;
        }
    });
    return BaseModel;
});
