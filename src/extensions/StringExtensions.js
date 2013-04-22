/*global define */
define([], function() {
    'use strict';

    String.prototype.replaceAll = function( replace, withThis ) {
        return this.replace(new RegExp(replace, 'g'), withThis);
    };

    if( typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function( term ) {
            return (this.slice(0, term.length) === term);
        };
    }

    String.prototype.stripTags = function() {
        return this.replace(/<\/?[^>]+>/ig, '');
    };

    String.prototype.removeDiacritics = function() {
        var diacritics = [
            [/[\300-\306]/g, 'A'],
            [/[\340-\346]/g, 'a'],
            [/[\310-\313]/g, 'E'],
            [/[\350-\353]/g, 'e'],
            [/[\314-\317]/g, 'I'],
            [/[\354-\357]/g, 'i'],
            [/[\322-\330]/g, 'O'],
            [/[\362-\370]/g, 'o'],
            [/[\331-\334]/g, 'U'],
            [/[\371-\374]/g, 'u'],
            [/[\321]/g, 'N'],
            [/[\361]/g, 'n'],
            [/[\307]/g, 'C'],
            [/[\347]/g, 'c']
        ];
        var s = this;
        for (var i = 0; i < diacritics.length; i++) {
            s = s.replace(diacritics[i][0], diacritics[i][1]);
        }
        return s;
    };

    String.prototype.toFriendlyUrl = function() {
        return this.removeDiacritics().toNormalizedUrl();
    };

    String.prototype.toNormalizedUrl = function() {
        return this.toLowerCase() // change everything to lowercase
            .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
            .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
            .replace(/[^a-z0-9-]+/g, "") // remove all non-alphanumeric characters except the hyphen
            .replace(/[-]+/g, "-") // replace multiple instances of the hyphen with a single instance
            .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
    };
    return {};
});
