/*global define */
define(['backbone', 'marionette'], function( Backbone ) {
    'use strict';
    var EmptyCompositeView = Backbone.Marionette.CompositeView.extend({
        disallowEmpty: true,
        disallowRendering: function() {
            return ( this.disallowEmpty && this.collection.length === 0 );
        },
        /* Overriding the default render to allow not to render */
        render: function(){
            if( this.disallowRendering() ) {
                return;
            }
            this.isClosed = false;
            this.resetItemViewContainer();

            this.triggerBeforeRender();
            var html = this.renderModel();
            this.$el.html(html);
            // the ui bindings is done here and not at the end of render since they
            // will not be available until after the model is rendered, but should be
            // available before the collection is rendered.
            this.bindUIElements();
            this.triggerMethod('composite:model:rendered');

            this._renderChildren();

            this.triggerMethod('composite:rendered');
            this.triggerRendered();
            return this;

        },
        // Render an individual model, if we have one, as
        // part of a composite view (branch / leaf). For example:
        // a treeview.
        renderModel: function(){

            if( this.disallowRendering() ) {
                return;
            }
            var data = {};
            data = this.serializeData();
            data = this.mixinTemplateHelpers(data);

            var template = this.getTemplate();
            return Backbone.Marionette.Renderer.render(template, data);

        }
    });

    return {
        EmptyCompositeView: EmptyCompositeView
    };
});
