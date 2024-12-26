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
    public activeBar: number = -1;

    public accelerator: Accelerator = defaultAccelerator;
    public acceleratorEnabled: boolean = false;

    public unlocked: boolean = false;
    public audioContext: AudioContext | null = null;
    public audioBuffers: AudioBuffer[] = [];
    public nextNoteTime: number = 0; // Next note's scheduled time
    public scheduleAheadTime: number = 0.1; // How far ahead to schedule (in seconds)
    public timerInterval: number = 25;
    private timerId: number | null = null;

    public get numBeats(): number {
        return this.beats.length;
    }

    public get beatUnit(): number[] {
        return this.beats.map((beat: Beat) => beat.beatUnit);
    }


    public setup() {
        this.audioContext = new AudioContext();
        this.setUpAudioContext()
        this.setUpAudioBuffers()
        //this.setUpWorker()
    }

    public setUpAudioContext() {
        if (!this.audioContext) { console.log("No Audio Context"); return; }
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const node = this.audioContext.createBufferSource();
        node.buffer = buffer;
        node.start(0);
        this.unlocked = true;
    }

    public async setUpAudioBuffers() {
        if (!this.audioContext) { console.log("No Audio Context"); return; }
        const audioBuffers = await Promise.all(audioPaths.map(async (path) => {
            return await loadAudioBuffer(path, this.audioContext!);
        }));
        this.audioBuffers = audioBuffers;
    }

    private scheduler() {
        if (!this.audioContext) { console.log("No Audio Context"); return; }
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote();
            this.advanceNote();
        }
    }

    private scheduleNote() {
        const currentBeatIndex = this.activeBar;
        const isAccent = this.accents[currentBeatIndex] === 1;

        // Load or use pre-loaded audio buffer
        const buffer = isAccent ? this.audioBuffers[2] : this.audioBuffers[0];

        if (!buffer) return;
        
        this.activeBar = (currentBeatIndex + 1) % this.numBeats;
        console.log(this.activeBar)
        if (this.activeBar >= 0)
            this.playSound(buffer, this.nextNoteTime);
    }

    private advanceNote() {
        const beatDuration = (60 / this.bpm)
        this.nextNoteTime += beatDuration;
    }

    public updateBpm(newBpm: number) {
        if (!validateBPM(newBpm, console.error)) return;
        this.bpm = newBpm;

        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }

    public toggle() {
        if (!validateBPM(this.bpm, console.error)) return;
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }


    private playSound(buffer: AudioBuffer, time: number) {
        if (!this.audioContext) { console.log("No Audio Context"); return; }
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
        if (!this.audioContext) { console.log("No Audio Context"); return; }
        if (this.isRunning) return;
        this.isRunning = true;


        this.nextNoteTime = this.audioContext.currentTime;
        this.scheduler();
        this.timerId = window.setInterval(() => this.scheduler(), this.timerInterval);
    }

    public stop() {
        if (!this.audioContext) { console.log("No Audio Context"); return; }

        if (!this.isRunning) return;
        this.isRunning = false;

        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }

        this.activeBar = -2;
        this.accelerator.progress = 0;
    }
}
