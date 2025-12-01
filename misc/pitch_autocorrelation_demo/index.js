const container = document.getElementById('container');

const fov = 60;
const camera = new THREE.PerspectiveCamera(fov, container.clientWidth / container.clientHeight, 0.01, 1000);
camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(container.clientWidth, container.clientHeight);    
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeff);
scene.add(camera);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 50, 35);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);

const audioCtx = new AudioContext();

const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const bufferLen = analyser.frequencyBinCount;
const buffer = new Float32Array(bufferLen);
const freqDomainBuf = new Float32Array(bufferLen);
let audioSource;
let audioFileUrl;
let animationFrameReqId;
let isPlaying = false;

// create and attach gain node (we can use a single gain node since there should only 1 note playing at a time)
const gainNode = new GainNode(audioCtx);
gainNode.connect(audioCtx.destination);

const noteBufferMap = {};
let readyToPlay = false;

// try to find beats?
let lastLargestFreq = 0;
const freqThreshold = 1.4; // how much of a delta needed between largest freq of now compared to the last one to consider the curr time a new beat

// gain node for making beat audible (helpful for debugging?)
const beatGainNode = audioCtx.createGain();
beatGainNode.connect(audioCtx.destination);

function determineBeat(freqDataBuffer){
  let currLargestFreq = 0;
  freqDataBuffer.forEach(val => currLargestFreq = Math.max(currLargestFreq, Math.abs(val)));
  if(currLargestFreq - lastLargestFreq >= freqThreshold){
    //console.log('writing beat');
    const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
    const height = 2 * Math.tan(vFOV / 2) * camera.position.z; // visible height
    const width = height * camera.aspect;           // visible width
    viewSize.x = width;
    viewSize.y = height;
    
    const viewWidth = viewSize.x;
    const viewHeight = viewSize.y;
    
    const xPos = 50;
    const yPos = viewHeight + 20;
    const zPos = -60;
    const newNoteObj = createNoteObject('red');
    scene.add(newNoteObj);
    newNoteObj.position.set(xPos, yPos, zPos);
    currentNoteObjects.push(newNoteObj);  

    if(beatOscNode){
      beatOscNode.frequency.setValueAtTime(600, audioCtx.currentTime); // set value to 0 to "turn off" beat oscillator
    }
  }else{
    if(beatOscNode){
      beatOscNode.frequency.setValueAtTime(0, audioCtx.currentTime);
    }    
  }
  
  lastLargestFreq = currLargestFreq;
}

let currentNoteObjects = [];
function createNoteObject(color){
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshBasicMaterial({color: (color || 0x0000ff)});
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  return cube;
}

function update(){
  // move stuff around, etc.
  //const viewHeight = viewSize.y;
  currentNoteObjects.forEach(o => {
    if(o.position.y < -40){
      // TODO: remove the object?
    }else{
      o.position.y -= 0.2;
    }
  });
}

function keydown(evt){
}
document.addEventListener('keydown', keydown);

function keyup(evt){
}
document.addEventListener('keyup', keyup);


// create a gain node to control volume for imported audio buffer source node
const bufferSourceNodeGain = audioCtx.createGain();
bufferSourceNodeGain.connect(audioCtx.destination);

// create a gain node to use for pitch autocorrelation
const newGainNode = audioCtx.createGain();
newGainNode.connect(audioCtx.destination);

let newOscNode;
let beatOscNode;

function playAudio(){
  if(!isPlaying && audioSource){
    isPlaying = true;
    
    // turn on gain node if wanting to play sine wave with autocorrelated pitch
    const playAutocorrelatedPitch = document.getElementById('playAutocorrelatedFreq').checked;
    if(playAutocorrelatedPitch && newGainNode){
      console.log('turning on gain node');
      newGainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      beatGainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      
      // create a new osc node
      newOscNode = audioCtx.createOscillator();
      newOscNode.type = "sine";
      newOscNode.connect(newGainNode);
      newOscNode.frequency.setValueAtTime(0, audioCtx.currentTime);
      newOscNode.start();
      
      // create another osc node for beats
      beatOscNode = audioCtx.createOscillator();
      beatOscNode.type = "square";
      beatOscNode.connect(beatGainNode);
      beatOscNode.frequency.setValueAtTime(0, audioCtx.currentTime);
      beatOscNode.start();
    }
    
    audioSource.start();
    autocorrelateAudio();
  }
}
document.getElementById('play').addEventListener('click', playAudio);

function stopAudio(){
  if(isPlaying && audioSource){
    isPlaying = false;
    audioSource.stop();
    
    // turn off gain node if wanting to play sine wave with autocorrelated pitch
    const playAutocorrelatedPitch = document.getElementById('playAutocorrelatedFreq').checked;
    if(playAutocorrelatedPitch && newGainNode && newOscNode){
      console.log('turning off gain node');
      newGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      newOscNode.stop();
      newOscNode = null;
      
      beatGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      beatOscNode.stop();
      beatOscNode = null;
    }
    
    window.cancelAnimationFrame(animationFrameReqId);
  }
  
  currentNoteObjects.forEach(o => scene.remove(o));
  currentNoteObjects = [];
    
  // reload since we can't restart buffer source
  if(audioFileUrl) loadAudioFile(audioFileUrl);
}
document.getElementById('stop').addEventListener('click', stopAudio);

// trying pitch detection from imported audio
// TODO: try/explore other methods other than autocorrelation? (if possible)
// autocorrelate is taken from: https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
// https://stackoverflow.com/questions/69237143/how-do-i-get-the-audio-frequency-from-my-mic-using-javascript
// https://stackoverflow.com/questions/42614146/web-audio-api-get-correct-frequency
// https://stackoverflow.com/questions/57827830/at-what-point-does-analysernode-execute-its-fft
// https://courses.physics.illinois.edu/phys406/sp2017/NSF_REU_Reports/2005_reu/Real-Time_Time-Domain_Pitch_Tracking_Using_Wavelets.pdf
// https://hajim.rochester.edu/ece/sites/zduan/teaching/ece477/lectures/Topic%204%20-%20Single%20Pitch%20Detection.pdf
function autoCorrelate(buf, sampleRate){
  // Implements the ACF2+ algorithm
  let SIZE = buf.length;
  let rms = 0;

  for(let i = 0; i < SIZE; i++){
    const val = buf[i];
    rms += val*val;
  }
  rms = Math.sqrt(rms/SIZE);
  if(rms < 0.01) // not enough signal
    return -1;

  let r1 = 0;
  let r2 = SIZE-1;
  const thres = 0.2;
  for(let i = 0; i < SIZE/2; i++)
    if(Math.abs(buf[i]) < thres){r1=i; break;}
  
  for(let i= 1; i < SIZE/2; i++)
    if(Math.abs(buf[SIZE-i]) < thres){r2=SIZE-i; break;}

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  const c = new Array(SIZE).fill(0);
  for(let i = 0; i < SIZE; i++)
    for(let j = 0; j < SIZE-i; j++)
      c[i] = c[i] + buf[j]*buf[j+i];

  let d = 0; 
  while(c[d] > c[d+1]) d++;
    
  let maxval=-1, maxpos=-1;
  for(let i = d; i < SIZE; i++){
    if(c[i] > maxval){
      maxval = c[i];
      maxpos = i;
    }
  }
    
  let T0 = maxpos;
  const x1 = c[T0-1];
  const x2 = c[T0];
  const x3 = c[T0+1];
  const a = (x1 + x3 - 2*x2)/2;
  const b = (x3 - x1)/2;
  if(a) T0 = T0 - b/(2*a);

  return sampleRate/T0;
}

const viewSize = new THREE.Vector2();
function autocorrelateAudio(){
  analyser.getFloatTimeDomainData(buffer);
  analyser.getFloatFrequencyData(freqDomainBuf); // get frequency domain data
  determineBeat(freqDomainBuf);
  const result = autoCorrelate(buffer, audioCtx.sampleRate);
  if(result !== -1){
    const freq = result;
    
    // if flag to play the auto-correlated pitch is set, set the oscillator node to that pitch
    const playAutocorrelatedPitch = document.getElementById('playAutocorrelatedFreq').checked;
    if(playAutocorrelatedPitch && newOscNode){
      newGainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      newOscNode.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      // create note object corresponding to frequency and add it to scene
      // the x position will be determined by the frequency
      
      // https://stackoverflow.com/questions/13350875/three-js-width-of-view
      
      // getViewSize is only in r162
      //camera.getViewSize(camera.position.z, viewSize); // not really sure atm what's a good value for distance (the first parameter)
      
      const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
      const height = 2 * Math.tan(vFOV / 2) * camera.position.z; // visible height
      const width = height * camera.aspect;           // visible width
      viewSize.x = width;
      viewSize.y = height;
      
      const viewWidth = viewSize.x;
      const viewHeight = viewSize.y;
      
      const newNoteObj = createNoteObject();
      const maxFreq = 4200; // ~C8 freq
      const minFreq = 60; // ~C2 freq
      
      if(freq <= maxFreq && freq >= minFreq){
        const xPos = viewWidth * ((maxFreq - freq) / maxFreq) + 20;
        const yPos = viewHeight + 20;
        const zPos = -60;
        scene.add(newNoteObj);
        newNoteObj.position.set(xPos, yPos, zPos);
        currentNoteObjects.push(newNoteObj);
      }
      
    }else if(!playAutocorrelatedPitch && newGainNode){
      newGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    
    const audioOff = document.getElementById('turnOffImportedAudio').checked;
    if(!audioOff){
      bufferSourceNodeGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
    }else{
      bufferSourceNodeGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
  }
  animationFrameReqId = window.requestAnimationFrame(autocorrelateAudio);
}

function loadAudioFile(url){
  audioSource = audioCtx.createBufferSource();  

  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';
  req.onload = function(){
    audioCtx.decodeAudioData(req.response, (buffer) => {
      if (!audioSource.buffer) audioSource.buffer = buffer;
      audioSource.connect(analyser);
      audioSource.connect(bufferSourceNodeGain);
    });
  };
  req.send();
}

const openFile = (function(){
  return function(handleFileFunc){
    if(isPlaying) return;
       
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
       
    function onFileChange(evt){
      const files = evt.target.files;
      if(files && files.length > 0){
        handleFileFunc(files[0]);
      }
    }
    
    fileInput.addEventListener('change', onFileChange, false);
    fileInput.click();
  }; 
})();

function handleFile(file){
  audioFileUrl = URL.createObjectURL(file);
  const type = /audio.*/;
  if(!file.type.match(type)){
    return;
  }
    
  const reader = new FileReader();
  reader.onload = (() => {})(file);
    
  reader.readAsDataURL(file);
  loadAudioFile(audioFileUrl);
}

document.getElementById('importAudio').addEventListener('click', () => {
  openFile(handleFile);
});

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  update();
}

animate();
