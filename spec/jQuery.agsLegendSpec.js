describe("jQuery.agsLegend", function() {
  var legend;
  var map;

  beforeEach(function() {
    map = {};
    
  });

  it("should not load the templates by defaults", function() {
    spyOn($,"ajax");
    legend = $('#target').agsLegend({map:map});
    expect($.ajax).not.toHaveBeenCalled();
  });
  it("should automatically load the templates when autoLoadTemplates is true", function() {
    spyOn($,"ajax");
    legend = $('#target').agsLegend({map:map,autoLoadTemplates:true, onTemplateLoaded:function(data){}});
    expect($.ajax).toHaveBeenCalled();
  });
  it("should change the templateURL if its' passed", function() {
    spyOn($,"ajax");
    var callback = function(){};
    legend = $('#target').agsLegend({map:map,autoLoadTemplates:true, templateFileURL:"othertemplates.txt",onTemplateLoaded:callback});
    expect($.ajax).toHaveBeenCalledWith({
          url:"othertemplates.txt",
          success:callback
       });
  });

/*
  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrow("song is already playing");
    });
  });*/
});
