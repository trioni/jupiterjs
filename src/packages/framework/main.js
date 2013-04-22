/*global define */
define(['jquery','labels','./Menu','./UserProfile', './Page','animatedanchor'], function( $, Intranet, Menu, UserProfile ) {
    'use strict';

    var Framework = {
        name: 'Framework',
        initialize: function() {
            Framework.initMenu();
            Framework.initPage();
            Framework.initTopLink();
            Framework.initShortcutsLink();
            Framework.initUserProfile();
        },
        initMenu: function() {
            var menuConfig = {
                '$nav': $('#navigation'),
                '$verbose': $('#navigation .main-navigation')
            };
            var menu = new Menu(menuConfig);
            menu.addClickHandlers();

            // IE fix
            var isIE = (/MSIE\s[89]/).test(window.navigator.userAgent);
            if (isIE) {
                var uls = $('.menu-verbose ul');
                menu.calcList(uls);
            }
        },
        initPage: function() {
            // Already instantiated. Singleton
        },
        initTopLink: function() {
            $('.scroll-to-top a').animatedAnchor({
                changeUrl: false
            });
        },
        initShortcutsLink: function() {
            $('.favorite-tool a').animatedAnchor({
                changeUrl: false
            });
        },
        initUserProfile: function() {
            this.userProfile = new UserProfile({
                el: $('.toggle-my-profile a')
            });
        }
    };
    return Framework;
});
