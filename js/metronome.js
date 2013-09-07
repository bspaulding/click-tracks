var Metronome = (function() {
  function bind(fn, scope) {
    return function() {
      return fn.apply(scope, arguments);
    }
  }

  function bindAll(object) {
    for ( var key in object ) {
      if ( 'function' === typeof object[key] ) {
        object[key] = bind(object[key], object);
      }
    }
  }

  function Metronome() {
    this.isPlaying = false;		// Are we currently playing?
    this.tempo = 120.0;			// tempo (in beats per minute)
    this.lookahead = 25.0;		// How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1;	// How far ahead to schedule audio (sec) This is calculated from lookahead, and overlaps next interval (in case the timer is late)
    this.nextNoteTime = 0.0;		// when the next note is due.
    this.noteResolution = 1;		// 1 = quarter note, 0.5 = eighth note, 0.25 sixteenth, etc.
    this.noteLength = 0.05;		// length of "beep" (in seconds)
    this.timerID = 0;			// setInterval identifier.
    this.audioContext = new webkitAudioContext();

    bindAll(this);
  }

  Metronome.prototype.setTempo = function(newTempo) {
    var wasPlaying = this.isPlaying;
    this.stop();

    this.tempo = newTempo;

    if ( wasPlaying ) {
      this.play();
    }
  }

  Metronome.prototype.nextNote = function() {
    this.nextNoteTime += this.nextNoteInterval();
  }

  Metronome.prototype.nextNoteInterval = function() {
    var secondsPerBeat = 60.0 / this.tempo;
    return this.noteResolution * secondsPerBeat;
  }

  Metronome.prototype.scheduleNote = function(time) {
    var osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);
    osc.frequency.value = 880.0;

    osc.noteOn(time);
    osc.noteOff(time + this.noteLength);
  }

  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  Metronome.prototype.scheduler = function() {
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = window.setTimeout(this.scheduler, this.lookahead);
  }

  Metronome.prototype.togglePlaying = function() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.play();
    } else {
      this.stop();
    }
  }

  Metronome.prototype.play = function() {
    this.nextNoteTime = this.audioContext.currentTime;
    this.scheduler();
  }

  Metronome.prototype.stop = function() {
    window.clearTimeout(this.timerID);
  }

  return Metronome;
}());
