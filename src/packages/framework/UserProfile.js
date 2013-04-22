/*global define tmq */
define(['jquery', 'tmq'], function( $ ) {
    'use strict';

    /**
    * UserProfile or 'My Profile' is found in the top right corner.
    */
    var UserProfile = function ( options ) {
        if ($.isEmptyObject( options.el ) || options.el === undefined) {
            return;
        }

        this.$element = options.el;
        this.bindClickHandler();
    };

    UserProfile.prototype.bindClickHandler = function () {
        this.$element.bind('click', this.toggleProfile);
        this.setupTmq();
    };

    UserProfile.prototype.toggleProfile = function (e) {
        e.preventDefault();

        var that = $(this),
            mommy = that.parents('.personal'),
            wrapper = mommy.children('div'),
            a = $('.toggle-my-profile a'),
            w = that.width(),
            h = $('.my-profile').outerHeight();

        if (w < 60 && !mommy.hasClass('open')) {
            mommy.addClass('open');
            a.addClass('expanded');
            wrapper.animate({
                height: h + 10
            }, 'slow');
        } else {
            wrapper.animate({
                height: '0px'
            }, 'fast', function () {
                a.removeClass('expanded');
                wrapper.removeAttr('style');
                mommy.removeClass('open');
            });
        }
    };

    /**
    * setupTmq
    * Test media queries and 900 px which is the breakpoint for 'About me'.
    */
    UserProfile.prototype.setupTmq = function () {
        var self = this;
        tmq([{
            test: "only screen",
            success: function () {
                /*
                * Testing 901px.
                * When going from an open My Profile on < 900 px to higher resolution,
                * the fixed height will remain, we need to remove it and remove the class 'open'.
                */
                tmq([{
                    test: "only screen and (min-width: 901px)",
                    success: function () {
                        // Remove height from My Profile if it is open
                        if ($('body').hasClass('resp-901') && $('.personal').hasClass('open')) {
                            $('.personal').removeClass('open');
                            $('.toggle-my-profile a').removeClass('expanded');
                            $('.personal > div').removeAttr('style');
                        }

                        $('body').removeClass('resp-901');
                    },
                    failure: function () {
                        if (!$('body').hasClass('resp-901')) {
                            $('body').addClass('resp-901');
                        }
                    }
                }]);
            },
            failure: function () {
                // Media queries not supported
            }
        }]);
    };
    return UserProfile;
});
