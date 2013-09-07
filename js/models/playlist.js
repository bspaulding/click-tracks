ClickTracks.Playlist = DS.Model.extend({
  name: DS.attr('string'),
  songs: DS.hasMany('song', { async: true }),

  currentSong: function() {
    return this.get('songs').filterProperty('isPlaying', true).objectAt(0);
  }.property('songs.@each.isPlaying'),
  currentIndex: function() {
    return this.get('songs').indexOf(this.get('currentSong'));
  }.property('currentSong'),
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
  },
  nextIndex: function() {
    var i = this.get('currentIndex') + 1;
    if ( i >= this.get('songs.length') ) {
      i = 0;
    }

    return i;
  }.property('currentIndex', 'songs.length'),
  nextSong: function() {
    return this.get('songs').objectAt(this.get('nextIndex'));
  }.property('songs', 'nextIndex'),
  next: function() {
    var nextSong = this.get('nextSong');
    this.get('currentSong').pause();
    nextSong.play();
  },
  previousIndex: function() {
    var i = this.get('currentIndex') - 1;
    if ( i < 0 ) {
      i = this.get('songs.length') - 1;
    }

    return i;
  }.property('currentIndex', 'songs.length'),
  previousSong: function() {
    return this.get('songs').objectAt(this.get('previousIndex'));
  }.property('previousIndex', 'songs'),
  previous: function() {
    var previousSong = this.get('previousSong');
    this.get('currentSong').pause();
    previousSong.play();
  }
});
