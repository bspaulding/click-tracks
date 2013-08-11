ClickTracks.Playlist = DS.Model.extend({
  name: DS.attr('string'),
  songs: DS.hasMany('ClickTracks.Song'),

  isPlaying: function() {
    return this.get('songs').filterProperty('isPlaying', true).get('length') > 0;
  }.property('songs.@each.isPlaying'),
  play: function() {
    if ( this.get('isPlaying') ) { return; }

    this.get('songs').objectAt(0).play();
  },
  pause: function() {
    this.get('songs').filterProperty('isPlaying', true).map(function(song) { song.pause(); });
  },
  playSong: function(song) {
    this.pause();
    song.play();
  },
  pauseSong: function(song) {
    song.pause();
  }
});
