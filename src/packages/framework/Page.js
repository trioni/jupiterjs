/*global define */
define(['jquery'], function( $ ) {
    'use strict';

    var Page = function() {
        this.queryDOM();
        this.setJsClass();
    };

    Page.prototype.queryDOM = function() {
        this.elements = {
            'body': $('body'),
            'footer': $('#footer'),
            'window': $(window),
            'document': $(document)
        };
    };

    Page.prototype.setJsClass = function() {
        document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/,'js');
    };

    Page.prototype.getElement = function( name ) {
        var validElements = ['window','document','footer','body'];
        if( $.inArray( name, validElements ) === -1) {
            throw '[Page] Element: ' + name + ' is not supported';
        }

        var self = this;
        function getEl() {
            return self.elements[name];
        }
        var el = getEl();
        if( !el.length ) {
            this.queryDOM();
            el = getEl();
        }
        return el;

    };

    Page.prototype.setClass = function( className, add ) {
        var b = this.getElement('body');
        if(add) {
            b.addClass( className );
        } else {
            b.removeClass( className );
        }
    };

    Page.prototype.measure = function() {
        this.measurements.documentHeight = this.getElement('document').height();
        this.measurements.footerHeight = this.getElement('footer').outerHeight();
        this.measurements.windowHeight = this.getElement('window').height();
    };

    Page.prototype.navigateToAnchor = function( target ) {
        var animationTargetId = this.getHref(target);
        this.animateToAnchor($(animationTargetId));
    };

    Page.prototype.animateToAnchor = function( $target, offset ) {
        offset = typeof offset !== 'undefined' ? offset : 5;
        var targetOffset = $target.offset().top - offset;

        this.$element.animate({
            'scrollTop': targetOffset
        }, 'slow', 'swing');
    };

    Page.prototype.getHref = function( anchor ) {
        return $(anchor).attr('href');
    };

    Page.prototype.setClass = function( className, add ) {
        var b = this.getElement('body');
        if(add) {
            b.addClass( className );
        } else {
            b.removeClass( className );
        }
    };

    // Page.prototype.adjustContentHeight = function( e ) {
    //     // Animate the height of the page to adjust to changes in shortcuts
    //     var shortcutsHeight, contentHeight;
    //     shortcutsHeight = jupiter.shortcuts.$element.height();
    //     contentHeight = jupiter.cache.elements.document.find('#content').height();

    //     // Adjust to the height of the shortcuts panel
    //     if(shortcutsHeight > jupiter.cache.measurements.contentHeight) {
    //         jupiter.cache.elements.content.animate({
    //             'height': shortcutsHeight
    //         }, 'fast');
    //     } else {
    //         // Adjust back to normal
    //         jupiter.cache.elements.content.animate({
    //             'height': jupiter.cache.measurements.contentHeight
    //         }, 'fast');
    //     }
    // };

    Page.prototype.getFooterPosition = function() {
        return this.getElement('footer').offset().top;
    };
    return new Page();
});
