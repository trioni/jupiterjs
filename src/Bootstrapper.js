require([
    'config'
], function() {
    'use strict';
    require([
        'jquery',
        'packageloader'
    ], function ($, packageloader) {

        $(document).ready(function () {
            packageloader.loadPackages();
        });
    });
});
