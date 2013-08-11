ClickTracks = Ember.Application.create();

ClickTracks.Store = DS.Store.extend({
  adapter: DS.FixtureAdapter
});

ClickTracks.Router.map(function() {
  this.resource('songs', function() {
    this.route('new', { path: '/new' });
  });
  this.resource('playlists', function() {
    this.route('show', { path: '/:id' });
    this.route('new', { path: '/new' });
  });
});

ClickTracks.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('songs.index');
  }
});

ClickTracks.PlaylistsIndexRoute = Ember.Route.extend({
  model: function() {
    return ClickTracks.Playlist.find();
  }
});

ClickTracks.PlaylistsShowRoute = Ember.Route.extend({
  model: function(params) {
    return ClickTracks.Playlist.find(params.id);
  },

  serialize: function(object) {
    return { id: object.get('id') };
  }
});

ClickTracks.SongsIndexRoute = Ember.Route.extend({
  model: function() {
    return ClickTracks.Song.find();
  }
});

ClickTracks.SongsShowRoute = Ember.Route.extend({
  model: function(params) {
    return ClickTracks.Song.find(params.id);
  },

  serialize: function(song) {
    return { id: song.get('id') };
  }
});

ClickTracks.SongsNewRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('model', ClickTracks.Song.createRecord({
      title: 'Untitled Song',
      bpm: 120
    }));
  }
});

ClickTracks.SongsIndexController = Ember.ArrayController.extend({
  sortProperties: ['title', 'bpm'],

  playSong: function(song) {
    this.map(function(aSong) { aSong.pause(); });
    song.play();
  },
  pauseSong: function(song) { song.pause(); }
});

ClickTracks.SongsNewController = Ember.ObjectController.extend({
  createSong: function() {
    this.get('model.store').commit();
    this.transitionTo('songs.index');
  }
});

ClickTracks.PlaylistsShowController = Ember.ObjectController.extend({
  play: function() {
    this.get('model').play();
  },
  pause: function() {
    this.get('model').pause();
  },
  playSong: function(song) {
    this.get('model').playSong(song);
  },
  pauseSong: function(song) {
    this.get('model').pauseSong(song);
  }
});
