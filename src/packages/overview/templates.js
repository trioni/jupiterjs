define(function(){

  this["JST"] = this["JST"] || {};

  this["JST"]["categoryitem"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<a href="javascript:void(0)" class="block-link" data-id="' +((__t = ( Id )) == null ? '' : __t) +'">' +((__t = ( Name )) == null ? '' : __t) +'</a>\n';}return __p};

  this["JST"]["overviewlist"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<h2>' +((__t = ( Title )) == null ? '' : __t) +'</h2>';}return __p};

  return this["JST"];
});