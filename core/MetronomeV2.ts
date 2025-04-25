import { playSound } from '~/utils/utils';
import { audioPaths } from "../constants"
import { defaultAccelerator } from '~/constants';
import type { IAcceleratorMetronome } from '~/interfaces/IAcceleratorMetronome';
import BaseMetronome from './BaseMetronome';
export default class MetronomeV2 extends BaseMetronome implements IAcceleratorMetronome {
    public beats: Beat[] = parseTimeSignature('4/4');
    public activeBeat: number = -1 - this.countInBeats.length;

    public get countInBeats(): Beat[] {
        return this.beats.filter(beat => beat.bar === -1);
    }

    public get mainBeats(): Beat[] {
        return this.beats.filter(beat => beat.bar !== -1);
    }

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
        return this.mainBeats.length;
    }

    public get beatUnitList(): number[] {
        return this.mainBeats.map((beat: Beat) => beat.beatUnit);
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
        
        // Update activeBeat
        if (this.activeBeat < -1) {
            this.activeBeat += 1;
        } else {
            this.activeBeat = (this.activeBeat + 1) % this.numBeats;
        }
        
        // Find the actual beat index in the array
        let beatIndex = this.activeBeat;
        if (beatIndex < 0) {
            // For negative indices, find the count-in beat
            const countInIndex = this.countInBeats.findIndex(beat => beat.beatIndex === beatIndex);
            if (countInIndex === -1) {
                console.error(`Count-in beat with index ${beatIndex} not found`);
                return;
            }
            beatIndex = countInIndex;
        } else {
            // For regular indices, offset by the count-in beats count
            beatIndex = this.countInBeats.length + beatIndex;
        }
                
        // Make sure the beat exists before accessing it
        if (beatIndex < 0 || beatIndex >= this.beats.length) {
            console.error(`Beat index ${beatIndex} out of bounds (0-${this.beats.length-1})`);
            return;
        }
        
        const beat = this.beats[beatIndex];
        const bufferIndex = beat.accent;
        const buffer = bufferIndex >= 0 ? this.audioBuffers[bufferIndex] : undefined;
        if (!buffer) return;
        
        // Play the main beat
        playSound(buffer, this.audioContext, this.nextNoteTime);
        
        // Schedule subdivision notes if subdivision > 1
        if (beat.subdivision > 1 && this.audioContext) {
            const subdivisionBuffer = this.audioBuffers[2]; // Use bufferIndex 2 for subdivisions
            if (subdivisionBuffer) {
                const beatDuration = (60 / this.bpm) / (beat.beatUnit / 4);
                const subdivisionDuration = beatDuration / beat.subdivision;
                
                // Schedule subdivision notes (skip the first one since we already played the main beat)
                for (let i = 1; i < beat.subdivision; i++) {
                    const noteTime = this.nextNoteTime + (i * subdivisionDuration);
                    playSound(subdivisionBuffer, this.audioContext, noteTime);
                }
            }
        }
    }

    private advanceNote() {
        // Get the correct index in the beats array
        let beatIndex = this.activeBeat;
        if (beatIndex < 0) {
            // For negative indices, find the count-in beat
            const countInIndex = this.countInBeats.findIndex(beat => beat.beatIndex === beatIndex);
            if (countInIndex === -1) {
                console.error(`Count-in beat with index ${beatIndex} not found in advanceNote`);
                return;
            }
            beatIndex = countInIndex;
        } else {
            // For regular indices, offset by the count-in beats count
            beatIndex = this.countInBeats.length + beatIndex;
        }
        
        // Make sure the beat exists
        if (beatIndex < 0 || beatIndex >= this.beats.length) {
            console.error(`Beat index ${beatIndex} out of bounds in advanceNote (0-${this.beats.length-1})`);
            return;
        }
        
        const beatDuration = (60 / this.bpm) / ((this.beats[beatIndex]).beatUnit / 4);
        this.nextNoteTime += beatDuration;
        
        if (this.acceleratorEnabled && this.activeBeat >= 0) {
            if (this.currentBeatInAcceleratorLoop == 0) {
                this.accelerator.progress = 100;
            } else {
                this.accelerator.progress = Math.floor(((this.currentBeatInAcceleratorLoop) / (this.numBeatsBeforeIncrement)) * 100);
            }

            this.currentBeatInAcceleratorLoop = (this.currentBeatInAcceleratorLoop + 1) % this.numBeatsBeforeIncrement;
            if (this.currentBeatInAcceleratorLoop == 1) {
                this.updateBpm(Math.min(this.accelerator.maxBpm, this.bpm + this.accelerator.bpmIncrement));
            }
        }
    }

    public override start() {
        super.start();
        if (!this.audioContext) { console.error("No Audio Context"); return; }

        if (this.acceleratorEnabled) {
            this.numBeatsBeforeIncrement = this.mainBeats.length * this.accelerator.numBarsToRepeat;
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
        this.activeBeat = -1 - this.countInBeats.length;
    }

    public updateTimeSignature(inputString: string) {
        try {
            this.beats = parseTimeSignature(inputString);
            this.activeBeat = -1 - this.countInBeats.length;
            // this.successCallback("New Time Signature Applied");
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
