(function(document) {

  'use strict';

  var app = document.querySelector('#app');
  app.addEventListener('dom-change', function() {

    var voice = document.querySelector('#webspeech');
    var running = false;

    // TODO: Dodaj ostale reci
    var upitnereci = ['kako', 'gde', 'zašto', 'kada', 'koliko', 'da li', 'ko je', 'ko su'];

    var startSpeech = function() {
      if (running) {
        return;
      }
      voice.recognition.lang = 'sr';
      voice.start();
    };

    // var endSpeech = function() {
    //   voice.stop();
    // };

    document.addEventListener('keydown', startSpeech);
    document.addEventListener('mousedown', startSpeech);
    // document.addEventListener('keyup', endSpeech);
    // document.addEventListener('mouseup', endSpeech);

    app.onResult = function(event) {
      console.log(voice.recognition);
      console.log(event.detail.result);
      this.result = event.detail.result;
      var reci = this.result.split(' ');
      if (reci[1] == 'li') {
        this.result += '?';
      } else {
        for (var i = 0; i < upitnereci.length; i++) {
          if (this.result.search(upitnereci[i]) === 0) {
            this.result += '?';
          }
        }
      }
      voice.text = '';
    };
    app.onStart = function() {
      running = true;
    };
    app.onEnd = function() {
      running = false;
    };

  });

})(document);
