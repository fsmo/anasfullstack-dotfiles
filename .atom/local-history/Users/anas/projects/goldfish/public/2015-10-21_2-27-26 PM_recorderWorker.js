var recLength = 0,
  recBuffersL = [],
  recBuffersR = [],
  sampleRate;

this.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
      break;
    case 'exportWAV':
      exportWAV(e.data.type);
      break;
    case 'exportMonoWAV':
      exportMonoWAV(e.data.type, e.data.includeHeader);
      break;
    case 'getBuffers':
      getBuffers();
      break;
    case 'clear':
      clear();
      break;
  }
};

function init(config){
  sampleRate = config.sampleRate;
}

function record(inputBuffer){
  recBuffersL.push(inputBuffer[0]);
  recBuffersR.push(inputBuffer[1]);
  recLength += inputBuffer[0].length;
}

function exportWAV(type){
  var bufferL = mergeBuffers(recBuffersL, recLength);
  var bufferR = mergeBuffers(recBuffersR, recLength);
  var interleaved = interleave(bufferL, bufferR);
  var dataview = encodeWAV(interleaved);
  var audioBlob = new Blob([dataview], { type: type });

  this.postMessage(audioBlob);
}

function exportMonoWAV(type, includeHeader) {
  console.log('worker includeHeader', includeHeader);
  var bufferL = mergeBuffers(recBuffersL, recLength);
  var dataview = encodeWAV(bufferL, true, includeHeader);
  var audioBlob = new Blob([dataview], { type: type });

  this.postMessage(audioBlob);
}

function getBuffers() {
  var buffers = [];
  buffers.push( mergeBuffers(recBuffersL, recLength) );
  buffers.push( mergeBuffers(recBuffersR, recLength) );
  this.postMessage(buffers);
}

function clear(){
  recLength = 0;
  recBuffersL = [];
  recBuffersR = [];
}

function mergeBuffers(recBuffers, recLength){
  var result = new Float32Array(recLength);
  var offset = 0;
  for (var i = 0; i < recBuffers.length; i++){
    result.set(recBuffers[i], offset);
    offset += recBuffers[i].length;
  }
  return result;
}

function interleave(inputL, inputR){
  var length = inputL.length + inputR.length;
  var result = new Float32Array(length);

  var index = 0,
    inputIndex = 0;

  while (index < length){
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples, mono, includeHeader){
  var bufferLength = samples.length * 2;

  if(includeHeader) {
    bufferLength += 38;
  }

  var buffer = new ArrayBuffer(bufferLength);
  var view = new DataView(buffer);

  if(includeHeader) {
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    // view.setUint32(4, 32 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 4, 'WAVE');
    /* format chunk identifier */
    writeString(view, 8, 'fmt ');
    /* format chunk length */
    view.setUint32(12, 16, true);
    /* sample format (raw) */
    view.setUint16(16, 1, true);
    /* channel count */
    view.setUint16(20, mono?1:2, true);
    /* sample rate */
    view.setUint32(22, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(24, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(28, 4, true);
    /* bits per sample */
    view.setUint16(32, 16, true);
    /* data chunk identifier */
    writeString(view, 34, 'data');
    /* data chunk length */
    // view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 38, samples);
  } else {
    floatTo16BitPCM(view, 0, samples);
  }

  return view;
}
