import { playSound } from '~/utils/utils';
import { audioPaths } from "../constants"
import { defaultAccelerator } from '~/constants';
import type { IAcceleratorMetronome } from '~/interfaces/IAcceleratorMetronome';
import BaseMetronome from './BaseMetronome';
export default class MetronomeV2 extends BaseMetronome implements IAcceleratorMetronome {
    public beats: Beat[] = parseTimeSignature('4/4');
    public activeBeat: number = -1;

    public accelerator: Accelerator = defaultAccelerator;
    public acceleratorEnabled: boolean = false;
    public numBeatsBeforeIncrement: number = 0;
    public currentBeatInAcceleratorLoop: number = 1;

    public audioContext: AudioContext | null = null;
    public audioBuffers: AudioBuffer[] = [];
    public nextNoteTime: number = 0; // Next note's scheduled time
    public scheduleAheadTime: number = 0.1; // How far ahead to schedule (in seconds)
    public timerInterval: number = 25;
    //public timerWorker: Worker | null = null;

    public get numBeats(): number {
        return this.beats.length;
    }

    public get beatUnitList(): number[] {
        return this.beats.map((beat: Beat) => beat.beatUnit);
    }

    public async setup() {
        this.audioContext = new AudioContext();
        this.audioBuffers = await setUpAudioBuffers(this.audioContext, audioPaths);
        //this.setUpWorker()
    }

    //TODO: Use Worker threads for audio event scheduling
    // private setUpWorker(){
    //     this.timerWorker = new Worker('./worker.js');
    //     this.timerWorker.onmessage = (e) => {
    //         if (e.data === 'tick') {
    //             this.scheduler();
    //         } else {
    //             console.log('message: ' + e.data);
    //         }
    //     };
    // }

    private scheduler() {
        if (!this.audioContext) { console.error("No Audio Context"); return; }
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote();
            this.advanceNote();
        }
    }

    private scheduleNote() {
        if (!this.audioContext) { console.error("No Audio Context"); return; }
        this.activeBeat = (this.activeBeat + 1) % this.numBeats;
        const bufferIndex = this.beats[this.activeBeat].accent;
        const buffer = bufferIndex >= 0 ? this.audioBuffers[bufferIndex] : undefined
        if (!buffer) return;

        if (this.activeBeat >= 0)
            playSound(buffer, this.audioContext, this.nextNoteTime);
    }

    private advanceNote() {
        if (this.activeBeat < 0) {
            return;
        }
        const beatDuration = (60 / this.bpm) / ((this.beats[this.activeBeat]).beatUnit / 4);
        this.nextNoteTime += beatDuration;
        if (this.acceleratorEnabled) {
            if (this.currentBeatInAcceleratorLoop == 0) {
                this.accelerator.progress = 100;
            } else {
                this.accelerator.progress = Math.floor(((this.currentBeatInAcceleratorLoop) / (this.numBeatsBeforeIncrement)) * 100)
            }

            this.currentBeatInAcceleratorLoop = (this.currentBeatInAcceleratorLoop + 1) % this.numBeatsBeforeIncrement;
            if (this.currentBeatInAcceleratorLoop == 1) {
                this.updateBpm(Math.min(this.accelerator.maxBpm, this.bpm + this.accelerator.bpmIncrement))
            }
        }

    }

    public override start() {
        super.start();
        if (!this.audioContext) { console.error("No Audio Context"); return; }

        if (this.acceleratorEnabled) {
            this.numBeatsBeforeIncrement = this.beats.length * this.accelerator.numBarsToRepeat;
        }
        this.currentBeatInAcceleratorLoop = 1;
        this.nextNoteTime = this.audioContext.currentTime;
        //timerWorker.postMessage("start");
        const timeoutId = window.setInterval(() => this.scheduler(), this.timerInterval);
        this.timeoutIds.push(timeoutId);
    }

    public override stop() {
        super.stop()
        //timerWorker.postMessage("stop");
        this.numBeatsBeforeIncrement = 1000;
        this.currentBeatInAcceleratorLoop = 1;
        this.accelerator.progress = 0;
        this.activeBeat = -1;
    }

    public updateTimeSignature(inputString: string) {
        try {
            this.beats = parseTimeSignature(inputString);
            this.successCallback("New Time Signature Applied");
        } catch (e) {
            this.errorCallback((e as Error).message);
        }

        if (this.isRunning == true) {
            this.restart();
        }
    }

    public toggleAccelerator() {
        this.acceleratorEnabled = !this.acceleratorEnabled;
        this.stop()
    }

    public setAccelerator(accelerator: Accelerator) {
        if (!validateAccelerator(accelerator, this.errorCallback)) return;
        this.stop();
        this.accelerator = accelerator;
        this.updateBpm(accelerator.startBPM);
        this.successCallback("Accelerator Settings Applied");
    }

    public clear() {
        this.stop();
        this.audioContext?.close();
    }
}
