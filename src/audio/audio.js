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
  console.log("note firing at", time); // 👈 are you seeing this?
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n");

export async function startAudio() {
  console.log("startAudio called"); // 👈 is the button wired up?
  await Tone.start();
  console.log("Tone state:", Tone.context.state); // 👈 should say "running"
  Tone.Transport.start();
  console.log("Transport started"); 
}

export async function stopAudio() {
  Tone.Transport.stop();
}
