/*global define */
/*global define */
define([], function() {
    'use strict';
    var RoleClassHelper = {
        getRoleClass: function( roleMatch ) {
            return ( roleMatch.IsRoleMatch ) ? 'for-me' : 'for-others';
        }
    };
    return RoleClassHelper;
});
