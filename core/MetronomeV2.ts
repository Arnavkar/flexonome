// import type { Accelerator } from '../utils/types';
import { loadAudioBuffer } from '~/utils/utils';
import { audioPaths } from "../constants"
import { defaultAccelerator } from '~/constants';
//import type IMetronome  from '~/interfaces/IMetronome';
//import type { BeatV2 } from '~/utils/types';

export default class MetronomeV2 {
    public bpm: number = 120;
    public isRunning: boolean = false;
    public beats: Beat[] = parseTimeSignature('4/4', this.bpm);
    public accents: number[] = [1, 0, 0, 0];
    public activeBar: number = -2;
    private timeoutIds: number[] = [];

    public accelerator: Accelerator = defaultAccelerator;
    public acceleratorEnabled: boolean = false;

    public drift: number = 0;

    private readonly scheduleAheadTime: number = 0.1;

    public unlocked: boolean = false;
    public audioContext: AudioContext | null = null;
    public audioBuffers: AudioBuffer[] = [];
    public timerWorker: Worker | null = null;

    public setup() {
        this.audioContext = new AudioContext();
        this.setUpAudioContext()
        this.setUpAudioBuffers()
        //this.setUpWorker()
    }

    public setUpAudioContext() {
        if (!this.audioContext) {console.log("No Audio Context"); return;}
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const node = this.audioContext.createBufferSource();
        node.buffer = buffer;
        node.start(0);
        this.unlocked = true;
    }

    public async setUpAudioBuffers() {
        if (!this.audioContext) {console.log("No Audio Context"); return;}
        const audioBuffers = await Promise.all(audioPaths.map(async (path) => {
            return await loadAudioBuffer(path, this.audioContext!);
        }));
        this.audioBuffers = audioBuffers;
    }

    private playSound(buffer: AudioBuffer, time: number) {
        if (!this.audioContext) {console.log("No Audio Context"); return;}
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(time);
    }

    // public setUpWorker(){
    //     this.timerWorker = new Worker('./worker.js');
    //     this.timerWorker.onmessage = (e) => {
    //         if(e.data === "tick"){
    //             this.schedule();
    //         }else{
    //             console.log("message: " + e.data);
    //         }
    //     }
    // }

    // public schedule(){
    //     if(!this.audioContext) return;

    //     while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime){
    //         this.scheduleNote(this.activeNote, this.nextNoteTime);
    //         this.nextNote();
    //     }
    // }

    // public async scheduleNote( beatNumber:number, time:number ) {
    //     if(!this.audioContext) return;

    //     // push the note on the queue, even if we're not playing.
    //     this.noteQueue.push({ note: beatNumber, time: time });

    //     // create a buffer source
    //     const source = this.audioContext.createBufferSource();
    //     const audioBuffer = await this.audioBuffers[2];
    //     source.buffer = audioBuffer; // low pitch sample
    //     source.connect(this.audioContext.destination);
    //     source.start(time);
    // }

    // public nextNote() {
    //     this.nextNoteTime += this.bufferLength * (60.0 / this.bpm);
    //     this.activeNote++
    //     if (this.activeNote == this.numBeats) {
    //         this.activeNote = 0;
    //     } 
    // }

    public start() {
        if (!this.audioContext) {console.log("No Audio Context"); return;}
        if (!this.isRunning) {
            const startTime = this.audioContext.currentTime;
            let currentBeatIndex = 0;
            //let currentBeatInAcceleratorLoop = 0;
            // let numBeatsBeforeIncrement = 0;

            // if (this.acceleratorEnabled) {
            //     numBeatsBeforeIncrement = this.beats.length * this.accelerator.numBarsToRepeat + 1;
            // }

            this.isRunning = true;

            this.beats.forEach((beat, index) => {
                const scheduleTime =
                    startTime + index * ((60 / this.bpm) * (beat.beatUnit / 4));

                const isAccent = this.accents[index % this.accents.length] === 1;

                if (isAccent && this.audioBuffers[2]) {
                    this.playSound(this.audioBuffers[2], scheduleTime);
                } else if (!isAccent && this.audioBuffers[1]) {
                    this.playSound(this.audioBuffers[1], scheduleTime);
                }

                currentBeatIndex = (currentBeatIndex + 1) % this.beats.length;

                // if (this.acceleratorEnabled) {
                //     currentBeatInAcceleratorLoop =
                //         (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
                //     this.accelerator.progress = Math.floor(
                //         (currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement - 1)) * 100
                //     );
                //     if (currentBeatInAcceleratorLoop === 0) {
                //         this.updateBpm(
                //             Math.min(
                //                 this.accelerator.maxBpm,
                //                 this.bpm + this.accelerator.bpmIncrement
                //             )
                //         );
                //     }
                // }
            });
        }
    }

    public stop() {
        if (!this.audioContext) {console.log("No Audio Context"); return;}

        if (this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.isRunning = false;
        this.activeBar = -2;
        this.accelerator.progress = 0;
    }
}
