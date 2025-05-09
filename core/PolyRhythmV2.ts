import { playSound } from '~/utils/utils';
import { audioPaths } from "../constants"
import { defaultAccelerator } from '~/constants';
import type { IAcceleratorMetronome } from '~/interfaces/IAcceleratorMetronome';
import BaseMetronome from './BaseMetronome';
import { validateBPM } from '~/utils/utils';

export default class PolyRhythmV2 extends BaseMetronome implements IAcceleratorMetronome {
    public ratios: number[] = [3, 4];
    public activeCircles: number[] = [-1, -1];
    public get totalTime(): number {
        return (60 / this.bpm) * this.ratios[0] 
    }

    public accelerator: Accelerator = defaultAccelerator;
    public acceleratorEnabled: boolean = false;
    public numBeatsBeforeIncrement: number = 0;
    public currentBeatInAcceleratorLoop: number = 1;

    public audioContext: AudioContext | null = null;
    public audioBuffers: AudioBuffer[] = [];
    public nextNoteTimes: number[] = [0,0]; // Next note's scheduled time
    public scheduleAheadTime: number = 0.1; // How far ahead to schedule (in seconds)
    public timerInterval: number = 25;
    
    public debounceTimeout: number | null = null;
    public debounceDelay: number = 300; // 300ms debounce delay

    public beats: Beat[] = this.constructBeats();

    public get beats_1(): Beat[] {
        return this.beats.slice(0, this.ratios[0])
    }

    public get beats_2(): Beat[] {
        return this.beats.slice(this.ratios[0], undefined)
    }

    public async setup() {
        this.audioContext = new AudioContext();
        this.audioBuffers = await setUpAudioBuffers(this.audioContext, audioPaths);
        //this.setUpWorker()
    }

    private constructBeats(): Beat[] {
        const beats:Beat[] = []
        for (let i = 0; i < this.ratios[0]; i++) {
            beats.push({
                beatIndex:i,
                beatUnit: 4,
                accent: 0
            } as Beat)
        }

        for (let i = 0; i < this.ratios[1]; i++) {
            beats.push({
                beatIndex: i + this.ratios[0],
                beatUnit: 4,
                accent: 2
            } as Beat)
        }
        return beats
    }

    private scheduler(index: number) {
        if (!this.audioContext) { console.error("No Audio Context"); return; }
        while (this.nextNoteTimes[index] < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(index);
            this.advanceNote(index);
        }
    }

    private scheduleNote(index: number) {
        if (!this.audioContext) { console.error("No Audio Context"); return; }
        const numBeats = this.ratios[index];
        const beatList = index == 0 ? this.beats_1 : this.beats_2;

        this.activeCircles[index] = (this.activeCircles[index] + 1) % numBeats;
        const bufferIndex = beatList[this.activeCircles[index]].accent;
        const buffer = bufferIndex >= 0 ? this.audioBuffers[bufferIndex] : undefined
        if (!buffer) return;

        if (this.activeCircles[index] >= 0)
            playSound(buffer, this.audioContext, this.nextNoteTimes[index]);
    }

    private advanceNote(index: number) {
        if (this.activeCircles[index] < 0) {
            return;
        }

        const beatDuration = this.totalTime / this.ratios[index]
        this.nextNoteTimes[index] += beatDuration;
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
            this.numBeatsBeforeIncrement = this.ratios[0] * this.accelerator.numBarsToRepeat + this.ratios[1] * this.accelerator.numBarsToRepeat;
        }
        this.currentBeatInAcceleratorLoop = 1;
        this.nextNoteTimes = [this.audioContext.currentTime, this.audioContext.currentTime];
        const timeoutId_1 = window.setInterval(() => this.scheduler(0), this.timerInterval);
        const timeoutId_2 = window.setInterval(() => this.scheduler(1), this.timerInterval);
        this.timeoutIds.push(timeoutId_1);
        this.timeoutIds.push(timeoutId_2);
    }

    public override stop() {
        super.stop()
        this.numBeatsBeforeIncrement = 1000;
        this.currentBeatInAcceleratorLoop = 1;
        this.accelerator.progress = 0;
        this.activeCircles = [-1, -1];
    }

    public pause() {
        this.numBeatsBeforeIncrement = 1000;
        this.currentBeatInAcceleratorLoop = 1;
        this.accelerator.progress = 0;
        this.activeCircles = [-1, -1];
    }

    public updateRatio(index:number ,value: number) {
        this.ratios[index] = value;
        this.beats = this.constructBeats();
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

    public override updateBpm(newBpm: number) {
        if (!validateBPM(newBpm, this.errorCallback)) return;

        if (this.acceleratorEnabled) { // if accelerator is enabled, don't debounce
            super.updateBpm(newBpm)
            return;
        }
        
        if (this.debounceTimeout) {
            window.clearTimeout(this.debounceTimeout);
        }
        
        const wasRunning = this.isRunning;
        if (wasRunning) {
            this.stop();
            this.isRunning = true; // hack to get the bpm to update since wasRunning checks against isRunning
        }

        this.debounceTimeout = window.setTimeout(() => {
            this.bpm = newBpm;
            if (wasRunning) {
                this.start();
            }
            this.debounceTimeout = null
        }, this.debounceDelay);
    }
}
