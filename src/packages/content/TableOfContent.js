/*global define */
define(['jquery', 'framework/Page', 'animatedanchor', 'scrollspy', 'pubsub'], function( $, Page ) {
    'use strict';

    var TableOfContent = function( options ) {
        if( !options.el ) {
            return false;
        }

        this.config = {
            threshold: options.threshold
        };

        this.$body = $('body');
        this.$element = $(options.el).first();

        this.$sections = options.sections;
        this.elementHeight = this.elementHeight();
        this.states = {
            EXPANDED: 'expanded',
            COLLAPSED: 'collapsed'
        };

        this.title = this.$element.find('h2').text();
        this.state = this.states.EXPANDED;
        this.activeTitle = '';

        if(this.determineIfSticky()) {
            this.setScrollSpyPositions();
        }
        this.bindSectionsScrollPositions();
        this.bindClickHandler();
        this.createToggleButton();
        this.initializePubSub();
    };

    TableOfContent.prototype.initializePubSub = function() {
        $.subscribe('document:height:change', $.proxy(this.documentHeightChangeHandler, this));
    };

    TableOfContent.prototype.documentHeightChangeHandler = function() {
        this.setScrollSpyPositions();
        this.bindSectionsScrollPositions();
    };

    TableOfContent.prototype.determineIfSticky = function() {
        var tocHeight, windowHeight;
        tocHeight = this.$element.outerHeight();
        windowHeight = $(window).height();

        return (tocHeight < windowHeight);
    };

    TableOfContent.prototype.elementHeight = function() {
        return this.$element.find('nav').height();
    };

    TableOfContent.prototype.isAboveThreshold = function() {
        return (Page.getElement('window').width() > this.config.threshold);
    };

    TableOfContent.prototype.setScrollSpyPositions = function() {
        var min = this.$element.offset().top,
            max = Page.getFooterPosition() - this.elementHeight;

        this.$element.scrollspy({
            min: min,
            max: max,
            onEnter: $.proxy( this.scrollEnterHandler, this ),
            onLeave: $.proxy( this.scrollLeaveHandler, this ),
            eventNamespace: '.toc'
        });

    };

    TableOfContent.prototype.scrollEnterHandler = function() {

        if(this.isAboveThreshold()) {
            this.stickToTop();
        } else {
            // Make sure ToC is not sticky
            this.clearInlineStyles();
            this.unstickFromTop();
        }
    };

    TableOfContent.prototype.scrollLeaveHandler = function( el, position ) {
        if(!this.isAboveThreshold()) {
            this.clearInlineStyles();
            this.unstickFromTop();
            return;
        }

        switch( this.getStickStatusByPosition( position ) ) {
            case 'stick':
                this.stickToBottom();
                break;
            case 'unstick':
                this.unstickFromTop();
                break;
            case 'nochange':
                break;
            default:
                break;
        }
    };

    TableOfContent.prototype.getStickStatusByPosition = function( position ) {
        if( this.state === this.states.COLLAPSED ) {
            return 'nochange';
        }
        return (position.top > (Page.getElement('document').height() / 2)) ? 'stick': 'unstick';
    };

    TableOfContent.prototype.stickToTop = function() {
        this.clearStickToBottom();
        this.$element.addClass('fixed');
        this.modifyBodyClass('top-fixed', true);
    };

    TableOfContent.prototype.unstickFromTop = function() {
        this.$element.removeClass('fixed');
        this.modifyBodyClass('top-fixed', false);
    };

    TableOfContent.prototype.modifyBodyClass = function( className, add ) {
        Page.setClass(className, add);
    };

    TableOfContent.prototype.stickToBottom = function() {
        var stickyPosition, currentZindex;
        stickyPosition = Page.getElement('footer').outerHeight() + 20;
        currentZindex = this.$element.css('z-index');
        this.$element.addClass('end');
        this.$element.css('bottom', stickyPosition);
        this.$element.css('z-index', currentZindex - 2);
    };

    TableOfContent.prototype.clearStickToBottom = function() {
        this.clearInlineStyles();
    };

    TableOfContent.prototype.clearInlineStyles = function() {
        this.$element.removeClass('end');
        this.$element.removeAttr('style');
    };

    TableOfContent.prototype.createToggleButton = function() {
        var $button;
        $button = this.createButtonMarkup();
        this.addChildTo( $button, 'header' );
        this.addClickHandler( $button, this.clickHandler );
    };

    TableOfContent.prototype.addClickHandler = function( $el, callback ) {
        $el.on('click', $.proxy( callback, this ));
    };

    TableOfContent.prototype.clickHandler = function( e ) {
        e.preventDefault();
        this.toggleState();
    };

    TableOfContent.prototype.createButtonMarkup = function() {
        return $('<a></a>', {
            'href': '#',
            'class': 'btn',
            'aria-hidden': true
        });
    };

    TableOfContent.prototype.addChildTo = function( $child, selector ) {
        $child.prependTo(this.$element.find( selector ));
    };

    TableOfContent.prototype.toggleState = function() {
        this.state = (this.state === this.states.EXPANDED) ? this.states.COLLAPSED : this.states.EXPANDED;
        this.$element.find('ul').slideToggle('fast');
        this.updateHeading();
    };

    TableOfContent.prototype.changeActiveItem = function( element ) {
        this.$element.find('li').removeClass('active');

        if (element !== null) {
            var selector = this.getSelectorById( element.id );
            this.$element.find(selector).closest('li').addClass('active');
        }
        this.changeActiveTitle();
        this.updateHeading();
    };

    TableOfContent.prototype.getSelectorById = function( id ) {
        return 'a[href="#' + id + '"]';
    };

    TableOfContent.prototype.changeActiveTitle = function() {
        var $activeElement = this.$element.find('.active a');
        if($activeElement) {
            this.activeTitle = $activeElement.text();
        } else {
            this.activeTitle = '';
        }
    };

    TableOfContent.prototype.updateHeading = function() {
        var $heading = this.getHeading();
        if(this.state === this.states.COLLAPSED && this.activeTitle !== '') {
            $heading.text(this.activeTitle);
        } else {
            $heading.text(this.title);
        }
    };

    TableOfContent.prototype.getHeading = function() {
        if( !this.$heading ) {
            this.$heading = this.$element.find('h2');
        }
        return this.$heading;
    };

    TableOfContent.prototype.bindSectionsScrollPositions = function() {
        var that, sectionMin, sectionMax, firstSection, nextSection;

        firstSection = this.$sections[0];

        that = this;

        that.$sections.each(function (i) {
            var position = $(this).offset();

            /** NOTE TO SELF: The positioning is dependent on when this measuring is triggered.
            * Since the positioning of these elements is determined of other elements.
            * Make sure the CSS is fully loaded when doing this (window.onload)
            **/
            sectionMin = position.top - 5;
            sectionMax = position.top + $(this).height();

            nextSection = that.$sections[i + 1];

            if(nextSection) {
                /**
                * 20 seems to be a good margin that lets
                * the triggering scrollpositions trigger correctly
                */
                sectionMax = $(nextSection).offset().top - 20;
            }

            $(this).scrollspy({
                min: sectionMin,
                max: sectionMax,
                onEnter: function (element, position) {
                    that.changeActiveItem(element, position);
                },
                onLeave: function (element, position) {
                    // Remove active item if scrollposition is above the first section
                    if ( that.isScrollAboveFirstSection( firstSection, element, position ) ) {
                        that.changeActiveItem(null);
                    }
                },
                eventNamespace:'.section' + i
            });
        });
    };

    TableOfContent.prototype.isScrollAboveFirstSection = function( firstSection, element, position) {
        return (element === firstSection && position.top <= $(firstSection).offset().top);
    };

    TableOfContent.prototype.bindClickHandler = function() {
        this.$element.find('li a').animatedAnchor();
    };
    return TableOfContent;
});
