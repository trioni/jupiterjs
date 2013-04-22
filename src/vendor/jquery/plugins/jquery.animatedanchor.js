/*global jQuery */
(function( $, undefined ){
    'use strict';
    var AnimatedAnchor = function( el, options ) {

        this.settings = $.extend({
          'changeUrl': true
        }, options);

        this.$el = $(el);
        this.$target = $('html,body');

        this.addClickHandler();
        return this;
    };
    AnimatedAnchor.prototype.addClickHandler = function() {
        this.$el.on('click', $.proxy(this.scrollToAnchor, this));
    };
    AnimatedAnchor.prototype.scrollToAnchor = function(e) {
        var anchor = e.target;
        e.preventDefault();
        this.toAnchor(anchor);
    };
    AnimatedAnchor.prototype.toAnchor = function( target ) {
        var animationTargetId = this._getHref(target);
        this._animateToAnchor($(animationTargetId));
    };
    AnimatedAnchor.prototype._animateToAnchor = function( $target, offset ) {
        offset = typeof offset !== 'undefined' ? offset : 5;
        var targetOffset = $target.offset().top - offset;
        targetOffset = (targetOffset < 0) ? 0 : targetOffset;
        this.$target.stop().animate({
            'scrollTop': targetOffset
        }, 'slow', 'swing', $.proxy(this.updateHash, this));
    };
    AnimatedAnchor.prototype.updateHash = function() {
        if( !this.settings.changeUrl ) {
            return;
        }
        var newHash = this.$el[0].hash;
        if( newHash !== '#body') {
            window.location.hash = newHash;
        }
    };
    AnimatedAnchor.prototype._getHref = function( anchor ) {
        return $(anchor).attr('href');
    };

    $.fn.animatedAnchor = function( options ) {
        return this.each(function(){
            new AnimatedAnchor( this, options );
        });
    };
}( jQuery ));
