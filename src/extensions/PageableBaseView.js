/*global define */
define(['underscore', 'jquery', 'backbone', 'labels'], function( _, $, Backbone, Intranet ) {
    'use strict';

    var token = '{0}',
        pageSize = Intranet.get('results:pagesize'),
        pagingNextLabel = Intranet.get('paging:next');

    /* Subclasses must have an implementation for getPreparedQueryModel()
     * which will prepare the search query. A PageableListView would
     * want to have to models. One to display data, and one for querying
     * entities from the server. The querying model should be a standalone QueryModel
     * found in querystring.getStandaloneModel()
     */

    var PageableBaseViewDefinition = {
        initPaging: function( options ) {

            if( options ) {
                this.loadingTargetSelector = options.loadingTargetSelector;
            }

            this._setModelDefaults();
            this.listenTo(this.collection, 'item:flag:old', this.markModelAsOld);
        },
        _setModelDefaults: function() {
            this.model.set({
                Paging: {
                    CurrentPage: 1,
                    PageCount: 1
                }
            }, {silent:true});
            this.model.set({
                hasMoreContent: this.hasMoreContent(),
                PagingNextLabel: this.getPagingNextLabel(),
                Length: this.collection.length
            }, {silent: true});
        },
        getPagingNextLabel: function() {
            var pageSize = this.getNextPageSize();
            var nextLabel = pagingNextLabel.replace(token, pageSize);
            return nextLabel;
        },
        getNextPageSize: function() {
            var paging = this.model.get('Paging');
            if( this.isNextLastPage( paging ) ) {
                return this.getHitsForLastPage();
            }
            return pageSize;
        },
        isNextLastPage: function( paging ) {
            return (paging.CurrentPage === (paging.PageCount - 1));
        },
        getHitsForLastPage: function() {
            var hits = (this.model.get('Hits') % pageSize);
            if( hits === 0 ) {
                hits = pageSize;
            }
            return hits;
        },
        onModelChange: function() {
            this.updateButtonVisibility();
            this.render();
        },
        loadPage: function( e ) {
            e.preventDefault();
            var reqModel = this.getPreparedQueryModel();
            this.fetchData( reqModel );
        },
        hasMoreContent: function() {
            var paging = this.model.get('Paging');
            if( !paging ) {
                return false;
            }
            return ( paging.PageCount > paging.CurrentPage );
        },
        getPreparedQueryModel: function() {
            throw new Error('Implementation missing. Subclasses must implement their own getPreparedQueryModel-method');
        },
        fetchData: function( model ) {
            this.setPageLoading( true );

            $.ajax({
                dataType: 'json',
                url: model.getRequestUrlForSearch(),
                success: $.proxy(this.onPageSuccess, this)
            });
        },
        _setLatestPageStartIndex: function( index ) {
            this.latestPageStartIndex = index;
        },
        onPageSuccess: function( response ) {
            this.setPageLoading( false );

            this._setLatestPageStartIndex( this.collection.length );

            var docs = response.Response.Docs;
            // 1. Set models as new
            this.markResponseAsNew( docs );

            // 2. append response to collection
            this.collection.add( docs );

            // 3. Update the paging object
            this.model.set({
                Paging: response.Response.Paging,
                Docs: this.collection,
                Length: this.collection.length
            });

            this.animateToPageBreak();
        },
        animateToPageBreak: function() {
            var child = this.getChildByIndex( this.latestPageStartIndex );
            this.scrollToChild( child );
        },
        scrollToChild: function( child ) {
            $('html,body').stop().animate({
                'scrollTop': this.getChildOffset( child )
            }, 'slow', 'swing', function() {
                // Focus has to be set after animation is complete to work around some strange behaviour
                child.setFocus();
            });
        },
        getChildByIndex: function( index ) {
            return this.children.findByIndex( index );
        },
        getChildOffset: function( child ) {
            return child.$el.offset().top;
        },
        getLoadingTarget: function() {
            if( this.loadinTargetEl ) {
                return this.loadingTargetEl;
            }

            var target = this.$el.find(this.loadingTargetSelector);
            this.loadingTargetEl = (target.length > 0) ? target : this.$el;
            return this.loadingTargetEl;
        },
        setPageLoading: function( loading ) {
            if( loading ) {
                this.getLoadingTarget().addClass('loading');
            } else {
                this.getLoadingTarget().removeClass('loading');
            }
        },
        markResponseAsNew: function( docs ) {
            _.each(docs, function( doc ) {
                doc.New = true;
            });
        },
        markModelAsOld: function( cid ) {
            var model = this.collection.get( cid );
            model.set('New', false);
        },
        updateButtonVisibility: function() {
            this.model.set({
                hasMoreContent: this.hasMoreContent(),
                PagingNextLabel: this.getPagingNextLabel()
            });
        },
        onCollectionReset: function() {
            this.model.set({
                Length: this.collection.length
            });
        }
    };

    var PageableBaseView = Backbone.Marionette.CompositeView.extend( PageableBaseViewDefinition );
    return PageableBaseView;
});
