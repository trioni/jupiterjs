/*global
    define
*/
define([
    'jquery',
    'underscore',
    'app'
], function ($, _, App) {
    'use strict';

    var packageloader = {
        loadPackages: function () {
            var packagesToLoad = findPackagesInDom(),
            totalPackages = packagesToLoad.length,
            numberOfPackagesLoaded = 1;
            _.each(packagesToLoad, function ( moduleName ) {
                require([moduleName], function ( LoadedModule ) {
                    App.addInitializer(LoadedModule.initialize);
                    if (numberOfPackagesLoaded === totalPackages) {
                        App.start();
                    }
                    numberOfPackagesLoaded++;
                });
            });
        }
    };

    var findPackagesInDom = function () {
        var packageNames = [];
        $('[data-package]').each(function ( index, element ) {
            var packageValues = $(element).data('package').split('|');
            packageNames.push(packageValues);
        });
        return _.flatten(packageNames);
    };

    return packageloader;
});
