var oldJquery = null;
$(function() {
    oldJquery = window.jQuery;
});
oldLegend = $.agsLegend;
module("jQuery AGS Legend", {
  setup: function(){
           $(targetId).empty();
          window.dojo = {connect:function(){}, hitch:function(){}};
            $.fn.agsLegend('setJQuery',jQuery);
         },
  teardown: function(){
            
            }
});

test("Default Options", function(){
  same($.agsLegend.defaults.ignoreBasemaps, true);
  //same($.agsLegend.defaultOptions.templateDOMid, "#layerTemplate");
});

test("Override Default Options", function(){
  //Arrange
  var toc = $("#qunit-target").agsLegend({
    ignoreBasemaps:false,
    templateDOMId:"#myLayerTemplate"
  });

  same($.agsLegend.defaults.ignoreBasemaps, false);
});

test("Get templates", function(){
  var mockJQuery = new Mock(),template = null;
  mockJQuery
    .expects(1)
    .method('ajax')
    .withArguments({
      url: 'templates.txt',
      success: Function
    })
    .callFunctionWith("<ul><li>template</li></ul>");
  var leg = $(targetId).agsLegend({map:{}});
  mockJQuery
    .expects(1)
    .property('agsLegend')
    .withValue(leg);

  $(targetId).agsLegend('setJQuery',mockJQuery);
  $(targetId).agsLegend('getTemplates');
    
    same(template, "<ul><li>template</li></ul>");
    ok(mockJQuery.verify(), "Verify ajax was called");
});
