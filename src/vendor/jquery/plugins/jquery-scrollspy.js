/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 *
 * Modified: 2013-02-17, Oskar Nordgren
 * - Added support for namespaced scroll events.
 *   Modifications will let you remove old eventhandlers specific to a context
 *   when resetting the scroll targets.
 *   Just call the scrollspy with a 'eventNamespace' option which will work as a context.
 */
 /*global jQuery*/


 ;(function ( $, window, document, undefined ) {
    'use strict';

    var ScrollSpy = {
        extendOptions: function( options ) {
            var defaults = {
                min: 0,
                max: 0,
                mode: 'vertical',
                buffer: 0,
                container: window,
                onEnter: options.onEnter ? options.onEnter : [],
                onLeave: options.onLeave ? options.onLeave : [],
                onTick: options.onTick ? options.onTick : []
            };
            return $.extend( {}, defaults, options );
        },
        scrollspy: function ( options ) {
            var opts = ScrollSpy.extendOptions( options );

            return this.each(function () {

                var element = this;
                var o = opts;
                var $container = $(o.container);
                var mode = o.mode;
                var buffer = o.buffer;
                var enters = 0, leaves = 0;
                var inside = false;

                var scrollHandler = function() {
                    var position = {top: $(this).scrollTop(), left: $(this).scrollLeft()};
                    var xy = (mode === 'vertical') ? position.top + buffer : position.left + buffer;
                    var max = o.max;
                    var min = o.min;

                      /* fix max */
                    if($.isFunction(o.max)){
                        max = o.max();
                    }

                    /* fix max */
                    if($.isFunction(o.min)){
                        min = o.min();
                    }

                    if(max === 0) {
                        max = (mode === 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();
                    }

                    /* if we have reached the minimum bound but are below the max ... */
                    if(xy >= o.min && xy <= max) {
                        /* trigger enter event */
                        if(!inside){
                            inside = true;
                            enters++;

                            /* fire enter event */
                            $(element).trigger('scrollEnter', {position: position});
                            if($.isFunction(o.onEnter)){
                                o.onEnter(element, position);
                            }
                        }

                        /* triger tick event */
                        $(element).trigger('scrollTick', {position: position, inside: inside, enters: enters, leaves: leaves});
                        if($.isFunction(o.onTick)){
                            o.onTick(element, position, inside, enters, leaves);
                        }
                    } else {

                        if(inside){
                            inside = false;
                            leaves++;
                            /* trigger leave event */
                            $(element).trigger('scrollLeave', {position: position, leaves:leaves});

                            if($.isFunction(o.onLeave)){
                                o.onLeave(element, position);
                            }
                        }
                    }
                };
                $container.off(o.eventNamespace);

                var eventName = 'scroll' + o.eventNamespace;
                $container.on(eventName, scrollHandler);

            });
        }
    };

    $.fn.extend( ScrollSpy );
})( jQuery, window );
