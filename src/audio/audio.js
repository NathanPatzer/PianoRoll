import * as Tone from "tone";

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sine" },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.3
  }
}).toDestination();

Tone.Transport.bpm.value = 170;

Tone.Transport.scheduleRepeat((time) => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n");

export async function startAudio() {
  await Tone.start();
  Tone.Transport.start();
}

export async function stopAudio() {
  Tone.Transport.stop();
}
