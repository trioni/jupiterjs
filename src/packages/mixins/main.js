/*global
    define
*/
define([
    'jquery',
    ], function( $ ) {
        'use strict';

        var GridViewMixin = {
            applyRowClasses: function( index, rowSize ) {
                if( this.isFirstOnRow( index, rowSize )) {
                    this.$el.addClass('first-on-row');
                }
                if( this.isLastOnRow( index, rowSize )) {
                    this.$el.addClass('last-on-row');
                }
            },
            isFirstOnRow: function( index, rowSize ) {
                return (index === 0 || (index % rowSize === 0));
            },
            isLastOnRow: function( index, rowSize ) {
                var order = index + 1;
                return (order % rowSize === 0);
            }
        };

        return {
            GridViewMixin: GridViewMixin
        };
    });
