/*global
    define
*/
define(['jquery','pubsub','tmq'], function( $ ) {
    'use strict';
    var Menu = function (options) {

        this.elements = $.extend({
            $nav: null,
            $verbose: null
        }, options);

        this.preventDefault = true;
        this.setupTmq();

        this.events = {
            change: 'menu.change'
        };
    };

    /**
    * Split <ul> into cols, devide <li> and append to new lists.
    *
    * @param ul {Object} Current <ul> to split.
    * @param no {Number} Number on current <ul>.
    */
    Menu.prototype.splitCols = function(ul, no) {
        var currentUl = $(ul),
            li = currentUl.find('li'),
            total = li.length,
            cols = 4,
            numInCols = Math.ceil(total / cols),
            i = 0, j,
            wrapper = $('<div id="columnify-' + no + '" class="split-me"' + ' />');

        wrapper.insertAfter(currentUl);
       
        for (j = 0; j < total; j += 1) {
            if (j % numInCols === 0 && i < cols) {
                i += 1;
                wrapper.append('<ul class="col' + i + '" />');
            }

            if (i === 5) {
                i = 4;
            }

            // Append lis to the right ul
            $(li[j]).appendTo('#columnify-' + no + ' .col' + i);
        }

        // Remove origin UL which is now empty.
        wrapper.siblings('ul').remove();
    };

    /**
    * If CSS 3 columns don't work, we need to fix them manually.
    * Run splitCols for every UL we have.
    *
    * @param uls {Array} Uls on page to split.
    */
    Menu.prototype.calcList = function (uls) {
        var l = uls.length, i;

        for (i = 0; i < l; i += 1) {
            this.splitCols(uls[i], i);
        }
    };

    Menu.prototype.addClickHandlers = function () {
        this.elements.$nav.find('.main-navigation > li').bind('click', '> a', $.proxy(this.clickHandler, this));

        $('.menu-verbose').bind('click', 'a', $.proxy(this.itemClickHandler, this));
        this.activateTriggers();
    };

    Menu.prototype.activateTriggers = function () {
        this.elements.$nav.find('.triggers').bind('click', 'a', $.proxy(this.triggerHandler, this));
    };

    Menu.prototype.deactivateTriggers = function () {
        this.elements.$nav.find('.triggers').unbind('click', 'a', $.proxy(this.triggerHandler, this));
    };

    Menu.prototype.triggerHandler = function (e) {
        e.preventDefault();

        var self = this,
            $target = $(e.target),
            nav = $('.main-navigation'),
            parent = nav.parents('.container'),
            h = nav.attr('data-height');

        if (nav.hasClass('open')) {
            self.animateHeight(nav, '0px', function() {
                nav.removeClass('open');
                $target.removeClass('active');
                self.clearMenuSelection();
                self.hideAll();
            });
        } else {
            $target.addClass('active');
            nav.addClass('open');
            self.animateHeight(nav, h);
        }
    };
    /**
     * Close menu on anchor click. Effect should be seen on the search page only.
     */
    Menu.prototype.itemClickHandler = function(e) {
        var self = this;

        if (e.target.tagName !== 'A' || document.getElementById('search') === null) {
            return;
        } else {
            self.close();
            // Add some delay to avoid flickering
            window.setTimeout(function () {
                self.clearMenuState();
            }, 200);
            window.clearTimeout(self.clearMenuState);
        }
    };

    Menu.prototype.clickHandler = function (e) {
        var $target = $(e.target),
            $targetTag = $target.get(0).tagName,
            section;

        // Don't do anything if the clicked element isn't an anchor
        if ($targetTag !== 'A') {
            return;
        }
        if (this.preventDefault && $target.siblings('.menu-verbose').length) {
            e.preventDefault();
            $target.parents('li').siblings('li').removeClass('selected');
            $target.parents('li').addClass('selected');

            $('#navigation').addClass('openNav');
            section = this.getVerboseSectionById(e.target.id);

            this.toggleMenu(section);
        }
    };

    Menu.prototype.getVerboseSectionById = function (id) {
        var verboseId = '#menu-' + id.split('-')[1];
        this.test = this.elements.$verbose;
        return this.elements.$verbose.find(verboseId);
    };

    Menu.prototype.toggleMenu = function ($openMenu) {
        if (this.selectedAlreadyActive($openMenu)) {
            this.close($openMenu);
            this.deselectNav();
            $('#navigation').removeClass('openNav');
            return;
        }
        this.adjustHeightToSelected($openMenu);
        this.hideAllButSelected($openMenu);
        this.showSelected($openMenu);
    };

    Menu.prototype.deselectNav = function () {
        this.elements.$nav.find('.selected').removeClass('selected');
    };

    Menu.prototype.selectedAlreadyActive = function ($openMenu) {
        var expanded = $($openMenu);
        return expanded.hasClass('expanded');
    };

    Menu.prototype.isSmallScreen = function () {
        return $('body').hasClass('resp-600');
    };

    Menu.prototype.close = function () {
        /* If small screen nav, else normal expanded nav */
        if (this.isSmallScreen()) {
            var h = this.elements.$nav.find('.main-navigation').attr('data-height');

            this.animateHeight(this.elements.$verbose, h, $.proxy(function() {
                this.animationComplete();
                this.hideAll();
            }, this));
        } else {
            var heightOfTabs = '43px';
            this.hideAll();
            this.animateHeight(this.elements.$verbose, heightOfTabs, $.proxy(this.animationComplete, this));
        }
    };

    Menu.prototype.animationComplete = function () {
        $.publish('before:document:height:change');
        $.publish('document:height:change');
    };

    Menu.prototype.showSelected = function ($openMenu) {
        $openMenu.show(0).addClass('expanded').removeAttr('style').attr('aria-hidden', false);
    };

    Menu.prototype.animateHeight = function (elem, height, callback) {
        callback = callback || function () {};
        elem.animate({
            'height': height
        }, 'fast', callback);
    };

    Menu.prototype.adjustHeightToSelected = function ($openMenu) {
        if ($openMenu.length && this.isSmallScreen()) {
            var menuHeight = parseInt($('.main-navigation').attr('data-height'), 10),
                border = 2,
                h = menuHeight + $openMenu.outerHeight() + border;

            this.animateHeight(this.elements.$verbose, h, $.proxy(this.animationComplete, this));
        } else if ($openMenu.length) {
            var marginBottom = 60,
                h = $openMenu.outerHeight();
            this.animateHeight(this.elements.$verbose, h + marginBottom, $.proxy(this.animationComplete, this));
        }
    };

    Menu.prototype.hideAllButSelected = function ($openMenu) {
        this.elements.$verbose.find('.menu-verbose').not($openMenu).removeClass('expanded').attr('aria-hidden', true);
    };

    Menu.prototype.hideAll = function () {
        $('.menu-verbose').removeClass('expanded').attr('aria-hidden', true);
    };

    Menu.prototype.isExpanded = function () {
        var bigExpanded = this.elements.$verbose.find('.expanded').length > 0,
            smallExpanded = this.elements.$nav.find('.main-navigation').hasClass('open');

        return bigExpanded || smallExpanded;
    };

    Menu.prototype.clearResponsiveState = function () {
        var nav = this.elements.$nav.find('.main-navigation');
        nav.removeClass('open');
        nav.parents('.container').removeAttr('style');
        this.elements.$nav.find('.triggers a').removeClass('active');
    };

    Menu.prototype.clearMenuSelection = function () {
        this.elements.$nav.find('li').removeClass('selected');
    };

    Menu.prototype.clearMenuState = function () {
        this.clearMenuSelection();
        this.clearStateVerbose();
    };

    Menu.prototype.clearStateVerbose = function () {
        this.elements.$verbose.removeAttr('style');
        this.elements.$verbose.find('.expanded').removeClass('expanded');
    };

    Menu.prototype.setupTmq = function () {
        var self = this;
        tmq([{
            test: "only screen",
            success: function () {
                /*
                * Testing 601 px.
                * At this breakingpoint, the main nav will look and behave totally different, let's close it so it doesn't look funny.
                * We do stuff once when reaching 601 px, then do stuff once again when passing above 601, no need to do it more than once ;-)
                */
                tmq([{
                    test: "only screen and (min-width: 601px)",
                    success: function () {
                        self.clearResponsiveState();

                        // Hide mobile nav when expanded, but only once when going from 600 to 800
                        if (self.isSmallScreen()) {
                            self.clearMenuState();
                        }

                        $('body').removeClass('resp-600');
                    },
                    failure: function () {
                        /* When coming from a big screen going to a small */
                        if (!self.isSmallScreen()) {
                            $('body').addClass('resp-600');

                            self.clearStateVerbose();
                            self.clearMenuSelection();

                            /* Remember default height, then hide nav */
                            var nav = self.elements.$nav.find('.main-navigation');
                            nav.attr('data-height', nav.height()).css('height', '0px');
                        }
                    }
                }])
            },
            failure: function () {
                // Media queries not supported
            }
        },
        {
            test: "only screen",
            success: function () {
                /*
                * Testing 800 px.
                * At this breakingpoint, the main nav will colapse to 600 px width, with 3 instead of 4 columns.
                * We do stuff once when reaching 800px, then do stuff once again when passing above 800, no need to do it more than once ;-)
                */
                tmq([{
                    test: "only screen and (min-width: 800px)",
                    success: function () {
                        // When our columns go back from 3 to 4, we need to adjust the height again, but only once!
                        if ($('body').hasClass('resp-800') && $('#navigation').hasClass('openNav')) {
                            self.adjustHeightToSelected(self.elements.$verbose.find('.expanded'));
                        }
                        $('body').removeClass('resp-800');
                    },
                    failure: function () {
                        // When our columns go from 4 to 3 we need to adjust the height, but only once!
                        if (!$('body').hasClass('resp-800') && $('#navigation').hasClass('openNav')) {
                            $('body').addClass('resp-800');
                            self.adjustHeightToSelected(self.elements.$verbose.find('.expanded'));
                        }
                    }
                }])
            },
            failure: function () {
                // Media queries not supported
            }
        }])
    };

    return Menu;
});
