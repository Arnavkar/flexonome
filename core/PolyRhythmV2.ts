import { playSound } from '~/utils/utils';
import { audioPaths } from "../constants"
import { defaultAccelerator } from '~/constants';
import type { IMetronome } from '~/interfaces/IMetronome';
import BaseMetronome from './BaseMetronome';

export default class PolyRhythmV2 extends BaseMetronome implements IMetronome {
    public ratios: number[] = [3, 4];
    public baseRatio: 0 | 1 = 1;
    public activeCircles: number[] = [-1, -1];
    public get totalTime(): number {
        if (this.baseRatio === 0){
            return (60 / this.bpm) * this.ratios[0] // Total time span for one cycle of the polyrhythm in seconds
        } else {
            return (60 / this.bpm) * this.ratios[1]
        }
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

    public get beatsLists(): Beat[][] {
        const beats_1:Beat[] = []
        for (let i = 0; i < this.ratios[0]; i++) {
            beats_1.push({
                beatIndex:i,
                beatUnit: 4,
                accent: 0
            } as Beat)
        }

        const beats_2:Beat[] = []
        for (let i = 0; i < this.ratios[1]; i++) {
            beats_2.push({
                beatIndex: i + this.ratios[0],
                beatUnit: 4,
                accent: 2
            } as Beat)
        }
        return [beats_1, beats_2]
    }

    public async setup() {
        this.audioContext = new AudioContext();
        this.audioBuffers = await setUpAudioBuffers(this.audioContext, audioPaths);
        //this.setUpWorker()
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
        const beatList = this.beatsLists[index];

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
        console.log(this.nextNoteTimes)
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
            this.numBeatsBeforeIncrement = this.ratios[this.baseRatio] * this.accelerator.numBarsToRepeat;
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

    public updateRatio(index:number ,value: number) {
        this.ratios[index] = value;
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
}
