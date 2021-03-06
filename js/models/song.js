ClickTracks.Song = DS.Model.extend({
  title: DS.attr('string'),
  bpm: DS.attr('number'),
  playlists: DS.hasMany('playlist', { async: true }),

  metronome: function() {
    if ( !this.get('_metronome') ) {
      var metronome = new Metronome();
      metronome.tempo = this.get('bpm');
      this.set('_metronome', metronome);
    }

    return this.get('_metronome');
  }.property(),

  isPlaying: false,
  play: function() {
    this.get('metronome').play();
    this.set('isPlaying', true);
  },
  pause: function() {
    this.get('metronome').stop();
    this.set('isPlaying', false);
  },
  togglePlaying: function() {
    if ( this.get('isPlaying') ) { this.pause(); } else { this.play(); }
  }
});

