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
    return this.get('store').findAll('playlist');
  }
});

ClickTracks.PlaylistsShowRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('playlist', params.id);
  },

  serialize: function(object) {
    return { id: object.get('id') };
  }
});

ClickTracks.SongsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').findAll('song');
  }
});

ClickTracks.SongsShowRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('song', params.id);
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

  actions: {
    toggleSong: function(song) {
      this.map(function(aSong) { if (aSong !== song) { aSong.pause(); } });
      song.togglePlaying();
    }
  }
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
  toggleSong: function(song) {
    this.get('model.songs').map(function(aSong) { if (aSong !== song) { aSong.pause(); } });
    song.togglePlaying();
  },
  playSong: function(song) {
    this.get('model').playSong(song);
  },
  pauseSong: function(song) {
    this.get('model').pauseSong(song);
  },
  next: function() {
    this.get('model').next();
  },
  previous: function() {
    this.get('model').previous();
  }
});
