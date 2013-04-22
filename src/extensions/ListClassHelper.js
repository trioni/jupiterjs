/*global define */
define([], function() {
    'use strict';
    var ListClassHelper = {
        firstLast: function( index, list ) {
            var orderClass = ' ', max = list.length - 1;
            if( index === 0 ) {
                orderClass = orderClass.concat('first');
            }
            if( index === max ) {
                orderClass = orderClass.concat('last');
            }
            return orderClass;
        }
    };
    return ListClassHelper;
});
