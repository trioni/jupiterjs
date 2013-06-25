/*global define */
define([
    /* List all modules that should be included in the app */
    'config',
    'jquery',
    'app',
    'router',
    'test'
], function (config, $, Test) {
    'use strict';
    /* This would be a great place to publish a startup-event or similar */
    $(document).ready(function () {
        Test.initialize();
    });

    return {};
});
