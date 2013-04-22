/*global define */
define(['jquery','./TableOfContent','embedr','embedrproviders'], function( $, TableOfContent ) {
    'use strict';
    var Content = {
        initialize: function() {
            Content.initTableOfContent();
            Content.initEmbedr();
        },
        initTableOfContent: function() {
            var tocEl = $('.table-of-content').get(0),
                $sections = $('.entity__body h2').not('.excluded').not('.table-of-content h2');

            new TableOfContent({
                el: tocEl,
                sections: $sections,
                threshold: 800
            });
        },
        initEmbedr: function() {
            $('.sthlm23video').embedr('sthlm23video', { width: $('.article:first').outerWidth() });
            $('.youtube').embedr('testprovider', { width: $('.article:first').outerWidth() });
        }
    };
    return Content;
});
