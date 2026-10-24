/* Irish speech recognition with Azure (ga-IE), a real Irish model, instead of Chrome's built-in recogniser.
   Records from the mic, stops by itself a moment after you finish speaking (or when you tap), turns the audio
   into 16 kHz WAV and sends it to Azure's short-audio endpoint with your own key from Settings. Loaded after app.js. */
'use strict';

function useAzureSTT(){ return hasAzure() && settings.stt !== 'chrome' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); }
window.activeListen = null;   // the listen in progress (a window property so app.js can stop it)

// Listen once. Resolves {text, alts, confidence}; rejects {code} with 'no-speech', 'no-match', 'key', 'network', 'mic' or 'cancelled'.
// onState('listening' | 'hearing' | 'checking') lets the UI follow along. listen.stop() finishes early; listen.cancel() abandons.
function azureListen(onState){
  let finish, cancel, done = false, manual = false;
  const p = new Promise(async (resolve, reject) => {
    let stream, ctx, proc, src;
    const chunks = [];
    let rate = 48000, heardSpeech = false, quietSince = 0, floor = 0, peak = 0, started = performance.now(), timer = null;
    const cleanup = () => { clearInterval(timer); try { proc && proc.disconnect(); src && src.disconnect(); } catch(e){} stream && stream.getTracks().forEach(t => t.stop()); ctx && ctx.close().catch(() => {}); if (activeListen === ctrl) activeListen = null; };
    cancel = () => { if (done) return; done = true; cleanup(); reject({code:'cancelled'}); };
    finish = async () => {
      if (done) return; done = true; cleanup();
      const secs = chunks.reduce((a, c) => a + c.length, 0) / rate;
      micLog('azure: stopped', {secs:+secs.toFixed(1), peak:+peak.toFixed(4), floor:+floor.toFixed(4), heardSpeech, manual, ctx:ctx && ctx.state});
      // Let Azure judge anything that isn't near-silence; the level gate only decides when to stop.
      if (!heardSpeech && peak < 0.003){ reject({code:'no-speech'}); return; }
      onState && onState('checking');
      try { resolve(await sendToAzure(toWav(chunks, rate))); } catch(e){ micLog('azure: failed', e); reject(e); }
    };
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true, channelCount:1}});
    } catch(e){ done = true; micLog('azure: mic refused', {name:e && e.name, message:e && e.message}); reject({code:'mic', name:e && e.name}); return; }
    if (done){ stream.getTracks().forEach(t => t.stop()); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    rate = ctx.sampleRate;
    micLog('azure: listening', {rate, ctx:ctx.state, track:(stream.getAudioTracks()[0] || {}).label || ''});
    src = ctx.createMediaStreamSource(stream);
    proc = ctx.createScriptProcessor(4096, 1, 1);
    // Keep the audio, and watch the level to tell when you start and stop speaking.
    proc.onaudioprocess = e => {
      const data = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(data));
      let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
      const rms = Math.sqrt(sum / data.length), now = performance.now();
      peak = Math.max(peak, rms);
      if (window.onMicLevel) onMicLevel(rms);
      if (now - started < 250){ floor = Math.max(floor, rms); return; }      // the room's background level
      if (rms > Math.max(0.006, floor * 2)){ if (!heardSpeech){ heardSpeech = true; onState && onState('hearing'); } quietSince = 0; }
      else if (heardSpeech && !quietSince) quietSince = now;
    };
    src.connect(proc); proc.connect(ctx.destination);
    onState && onState('listening');
    timer = setInterval(() => {
      const now = performance.now();
      if (heardSpeech && quietSince && now - quietSince > 1100) finish();    // a pause after speaking
      else if (!heardSpeech && now - started > 6000) finish();             // nothing said
      else if (now - started > 12000) finish();                            // long enough
    }, 100);
  });
  const ctrl = {promise:p, stop:() => { manual = true; finish && finish(); }, cancel:() => { micLog('azure: cancelled'); cancel && cancel(); }};
  activeListen = ctrl;
  return ctrl;
}

// Join the recorded chunks, resample to 16 kHz mono, and wrap as 16-bit PCM WAV.
function toWav(chunks, rate){
  const len = chunks.reduce((a, c) => a + c.length, 0), all = new Float32Array(len);
  let o = 0; for (const c of chunks){ all.set(c, o); o += c.length; }
  const ratio = rate / 16000, n = Math.floor(len / ratio), pcm = new Int16Array(n);
  for (let i = 0; i < n; i++){
    const a = Math.floor(i * ratio), b = Math.min(len, Math.floor((i + 1) * ratio));
    let s = 0; for (let j = a; j < b; j++) s += all[j];
    const v = Math.max(-1, Math.min(1, s / Math.max(1, b - a)));
    pcm[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  const buf = new ArrayBuffer(44 + pcm.length * 2), d = new DataView(buf);
  const str = (off, s) => { for (let i = 0; i < s.length; i++) d.setUint8(off + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); d.setUint32(4, 36 + pcm.length * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true); d.setUint32(24, 16000, true);
  d.setUint32(28, 32000, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); str(36, 'data'); d.setUint32(40, pcm.length * 2, true);
  new Int16Array(buf, 44).set(pcm);
  return new Blob([buf], {type:'audio/wav'});
}

async function sendToAzure(wav){
  let res;
  try {
    res = await fetch('https://' + encodeURIComponent(settings.azureRegion) + '.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ga-IE&format=detailed&profanity=raw', {
      method:'POST',
      headers:{'Ocp-Apim-Subscription-Key':settings.azureKey, 'Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000', 'Accept':'application/json'},
      body: wav
    });
  } catch(e){ throw {code:'network'}; }
  micLog('azure: reply', {status:res.status, region:settings.azureRegion, wavKB:Math.round(wav.size / 1024)});
  if (res.status === 401 || res.status === 403) throw {code:'key'};
  if (!res.ok) throw {code:'network', status:res.status};
  const j = await res.json();
  micLog('azure: result', {status:j.RecognitionStatus, text:j.DisplayText, best:j.NBest && j.NBest[0] && j.NBest[0].Lexical, conf:j.NBest && j.NBest[0] && j.NBest[0].Confidence});
  if (j.RecognitionStatus === 'InitialSilenceTimeout' || j.RecognitionStatus === 'BabbleTimeout') throw {code:'no-speech'};
  if (j.RecognitionStatus !== 'Success' || !j.NBest || !j.NBest.length) throw {code:'no-match'};
  const best = j.NBest[0];
  const alts = [...new Set(j.NBest.flatMap(n => [n.Display, n.Lexical]).filter(Boolean))];
  return {text: best.Display || best.Lexical || j.DisplayText || '', alts, confidence: best.Confidence || 0};
}

function listenError(e){
  return ({
    'no-speech':'I didn’t hear anything. Tap the mic and try again.',
    'no-match':'I couldn’t make out the Irish. Try again, a little slower.',
    'key':'Azure rejected the key. Check your Azure key and region in Settings.',
    'network':'Couldn’t reach Azure. Check your connection, or switch to the phone’s recogniser in Settings.',
    'mic':'Microphone is blocked. Allow it for this site in Chrome, then try again.'
  })[e && e.code] || 'Something went wrong. Tap the mic to try again.';
}

/* ---------- Mic log: the last 40 mic events, kept on the phone so they can be copied for troubleshooting ---------- */
function micLog(event, data){
  try {
    const log = JSON.parse(localStorage.getItem('labhair-miclog') || '[]');
    log.push({t:new Date().toISOString().slice(11, 19), event, ...(data && typeof data === 'object' ? data : {})});
    localStorage.setItem('labhair-miclog', JSON.stringify(log.slice(-40)));
  } catch(e){}
}
