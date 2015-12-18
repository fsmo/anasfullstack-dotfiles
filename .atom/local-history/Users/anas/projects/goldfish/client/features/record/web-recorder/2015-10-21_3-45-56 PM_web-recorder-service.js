App.service('webRecorderService', [function(){

  window.AudioContext  = window.AudioContext || window.webkitAudioContext;
  var self             = this;
  var isFirstChunk     = false;
  var chunkNumber      = 0;
  audioContext         = new AudioContext();
  this.analyserContext = null;
  this.audioInput      = null;
  this.realAudioInput  = null;
  this.inputPoint      = null;
  this.audioRecorder   = null;
  this.audioStreamer   = null;
  this.rafID           = null;
  this.canvasWidth     = null;
  this.canvasHeight    = null;
  this.blob            = null;

  this.saveAudio = function () {
      self.audioRecorder.exportWAV( self.doneEncoding );
  };

  this.drawBuffer = function ( width, height, context, data ) {
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = 'silver';
    context.clearRect(0,0,width,height);
    for(var i=0; i < width; i++){
      var min = 1.0;
      var max = -1.0;
      for (var j=0; j<step; j++) {
          var datum = data[(i*step)+j];
          if (datum < min){min = datum;
          }
          if (datum > max){max = datum;}
      }
      context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
  };

  this.gotBuffers = function ( buffers ) {
    var canvas = document.getElementById( 'wavedisplay' );
    self.drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
    self.audioRecorder.exportWAV( self.doneEncoding );
  };

  this.doneEncoding = function ( blob ) {
    self.blob = blob;
    Recorder.setupDownload( blob, 'goldFish.wav' );
  };

  function encodeBuffersToWav(input) {
    var buffer = new ArrayBuffer(input.length * 2);
    var output = new DataView(buffer);
    var offset = 0;

    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return output;
  }

  function sendBlob(blob){
    var reader = new FileReader();
    reader.onload = function(event) {
      Meteor.call('stream', event.target.result);
    };
    reader.readAsBinaryString(blob);
  }

  this.startStreaming = function() {
    chunkNumber = 0;

    self.audioStreamer.record();

    Meteor.call('startStream');

    setInterval(function() {
      console.log('chunkNumber ', chunkNumber);

      // if (isFirstChunk) {
        console.log('First Chunk');
        self.audioStreamer.exportMonoWAV(function(blob) {
          if (blob.size > 44) {
            sendBlob(blob);
          }
        }, 'audio/wav', isFirstChunk);
          self.audioStreamer.clear();
        chunkNumber += 1;
      // } else {
      //   console.log('Not First Chunk');
      //   self.audioStreamer.getBuffers(function(buffers){
      //     self.audioStreamer.clear();
      //     var encodedWav = encodeBuffersToWav(buffers[0]);
      //     var wavBlob = new Blob([encodedWav]);
      //     sendBlob(wavBlob);
      //     chunkNumber += 1;
      //   });
      // }
      isFirstChunk = false;
    }, 3000);
  };

  this.startRecording= function () {
    if (!self.audioRecorder){
      return;
    }
    isFirstChunk = true;
    self.audioRecorder.clear();
    self.audioRecorder.record();
    self.startStreaming();
  };

  this.stopStreaming = function(){
    self.audioStreamer.stop();
    // Meteor.subscribe('stopStream');
    Meteor.call('endStream');
  };

  this.stopRecording= function () {
    self.audioRecorder.stop();
    self.audioRecorder.getBuffers( self.gotBuffers );
    self.stopStreaming();
  };

  this.convertToMono = function( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
  };

  this.cancelAnalyserUpdates = function() {
      window.cancelAnimationFrame( self.rafID );
      self.rafID = null;
  };

  this.updateAnalysers = function(time) {
    if (!self.analyserContext) {
      var canvas = document.getElementById('analyser');
      self.canvasWidth = canvas.width;
      self.canvasHeight = canvas.height;
      analyserContext = canvas.getContext('2d');
    }
    // analyzer draw code here
    {
      var SPACING = 3;
      var BAR_WIDTH = 1;
      var numBars = Math.round(self.canvasWidth / SPACING);
      var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

      analyserNode.getByteFrequencyData(freqByteData);

      analyserContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
      analyserContext.fillStyle = '#F6D565';
      analyserContext.lineCap = 'round';
      var multiplier = analyserNode.frequencyBinCount / numBars;

      // Draw rectangle for each frequency bin.
      for (var i = 0; i < numBars; ++i) {
        var magnitude = 0;
        var offset = Math.floor( i * multiplier );
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 0; j< multiplier; j++)
            magnitude += freqByteData[offset + j];
        magnitude = magnitude / multiplier;
        var magnitude2 = freqByteData[i * multiplier];
        analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        analyserContext.fillRect(i * SPACING, self.canvasHeight, BAR_WIDTH, -magnitude);
      }
    }
    self.rafID = window.requestAnimationFrame( self.updateAnalysers );
  };

  this.toggleMono = function () {
    if (self.audioInput != self.realAudioInput) {
      self.audioInput.disconnect();
      self.realAudioInput.disconnect();
      self.audioInput = self.realAudioInput;
    } else {
      self.realAudioInput.disconnect();
      self.audioInput = self.convertToMono( self.realAudioInput );
    }
    self.audioInput.connect(self.inputPoint);
  };

  this.initAudio = function() {
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    if (!navigator.cancelAnimationFrame) navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame) navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
    navigator.getUserMedia({
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        },
      },
      function(stream) {
        self.inputPoint = audioContext.createGain();

        // Create an AudioNode from the stream.
        self.realAudioInput = audioContext.createMediaStreamSource(stream);
        self.audioInput = self.realAudioInput;
        self.audioInput.connect(self.inputPoint);

        //    self.audioInput = self.convertToMono( input );

        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        self.inputPoint.connect(analyserNode);

        self.audioRecorder = new Recorder(self.inputPoint);
        self.audioStreamer = new Recorder(self.inputPoint);

        zeroGain = audioContext.createGain();
        zeroGain.gain.value = 0.0;
        self.inputPoint.connect(zeroGain);
        zeroGain.connect(audioContext.destination);
        self.updateAnalysers();
      },
      function(e) {
        alert('Error getting audio');
        console.log(e);
      });
  };
}]);
