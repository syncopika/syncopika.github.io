// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.tabcapture-recorder/offscreen.js

let mediaRecorder = null;
let audioChunks = [];

chrome.runtime.onMessage.addListener(async (msg) => {
  if(msg.target !== 'offscreen') return;
  
  if(msg.type === 'start-record'){
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: msg.data,
        }
      }
    });
    
    console.log('capturing audio...');
    
    const output = new AudioContext();
    console.log(output);
    
    const source = output.createMediaStreamSource(media);
    source.connect(output.destination);

    mediaRecorder = new MediaRecorder(media);
    mediaRecorder.start();

    mediaRecorder.onstop = async () => {
      console.log('downloading audio...');
      
      const filename = `record_audio_extension_output_${Date.now()}`;
      
      // download WAV
      // https://stackoverflow.com/questions/76422024/how-to-get-wav-instead-of-ogg-using-web-audi-api
      const oggblob = new Blob(audioChunks, {type: 'audio/ogg; codecs=opus'});
      
      // convert ogg to WAV
      const audioBuffer = await output.decodeAudioData(await oggblob.arrayBuffer());
      const wavData = encodeWAV(audioBuffer);
      
      const blob = new Blob([wavData], {type: 'audio/wav'});
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      audioChunks = [];
    }

    mediaRecorder.ondataavailable = (evt) => {
      audioChunks.push(evt.data);
    }
  }
  
  if(msg.type === 'stop-record'){
    if(mediaRecorder){
      console.log('stopping media recorder');
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      //mediaRecorder = null;
    }
  }
});

/****

useful code from recorder.js
https://github.com/mattdiamond/Recorderjs/blob/master/src/recorder.js\

*****/
function encodeWAV(samples){
  // assuming 2-channel audio data so we need to interleave the sample data
  const audioData = interleave(
    samples.getChannelData(0),
    samples.getChannelData(1)
  );
  
  const tempBuffer = new ArrayBuffer(44 + (audioData.length * 2));
  const view = new DataView(tempBuffer); //dataview needs an arraybuffer (not audiobuffer)
  
  console.log(samples);

  /*
    the following steps sets up the metadata chunk for the wav file. 
  */

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + (audioData.length * 2), true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, samples.numberOfChannels, true); 
  /* sample rate */
  view.setUint32(24, samples.sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, samples.sampleRate * samples.numberOfChannels * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, samples.numberOfChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, audioData.length * 2, true);

  floatTo16BitPCM(view, 44, audioData); //getChannelData() gets the audio data as Float32Array

  return view;
}

function interleave(inputL, inputR){
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);

  let index = 0;
  let inputIndex = 0;

  while(index < length){
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  
  return result;
}

function writeString(view, offset, string) {
  for(let i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output, offset, input){
  for(let i = 0; i < input.length; i++, offset += 2){
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}