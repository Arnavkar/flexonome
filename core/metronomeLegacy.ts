import type { Accelerator } from '../utils/types';
import { parseTimeSignature, validateBPM } from '../utils/utils';
import { defaultAccelerator } from '~/constants';
import type { IMetronome }  from '../interfaces/IMetronome';
import BaseMetronome from './BaseMetronome';

export default class Metronome extends BaseMetronome implements IMetronome {
  public beats: Beat[] = parseTimeSignature('4/4');
  public activeBar: number = -2;

  public accelerator: Accelerator = defaultAccelerator;
  public acceleratorEnabled: boolean = false;

  public drift: number = 0;

  public get numBeats(): number {
    return this.beats.length;
  }

  public get beatUnitList(): number[] {
    return this.beats.map((beat: Beat) => beat.beatUnit);
  }

  public override start(){
    super.start()
    let currentBeatIndex = 0;
    let currentBeatInAcceleratorLoop = 0;
    let numBeatsBeforeIncrement = 0;
    const start = Date.now()
    let totalTime = 0;

    if (this.acceleratorEnabled) {
      numBeatsBeforeIncrement = this.beats.length * this.accelerator.numBarsToRepeat + 1;
    }

    const tic = () => {
      const currentBeat = this.beats[currentBeatIndex];
      const timeDrift = Math.max((new Date().getTime() - start) - totalTime, 0);
      this.drift = timeDrift;

      this.activeBar = currentBeat.beatIndex;
      currentBeatIndex = (currentBeatIndex + 1) % this.beats.length;

      const interval = (60000 / this.bpm) / ((this.beats[this.activeBar]).beatUnit / 4);
      const timeoutId = window.setTimeout(tic, interval - timeDrift)
      this.timeoutIds.push(timeoutId);
      totalTime += interval;

      if (this.acceleratorEnabled) {
        currentBeatInAcceleratorLoop = (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
        this.accelerator.progress = Math.floor((currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement - 1)) * 100)
        if (currentBeatInAcceleratorLoop == 0) {
          this.updateBpm(Math.min(this.accelerator.maxBpm, this.bpm + this.accelerator.bpmIncrement));
        }
        console.log(`activeBar: ${this.activeBar}, currentBeatInAcceleratorLoop: ${currentBeatInAcceleratorLoop}`)
      }
    }
    
    tic()
  }

  public override stop() {
    super.stop();
    this.accelerator.progress = 0;
    this.activeBar = -2;

  }

  public override updateBpm(newBpm: number) {
    if (!validateBPM(newBpm,this.errorCallback)) return;
    this.bpm = newBpm;
    this.beats.forEach(beat => {
      beat.interval = (60 / newBpm) * 1000 / (beat.beatUnit / 4);
    });
    if (this.isRunning == true) {
      this.restart();
    }
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
  };

  public setAccelerator(accelerator: Accelerator) {
    if (!validateAccelerator(accelerator,this.errorCallback)) return;
    this.stop();
    this.accelerator = accelerator;
    this.updateBpm(accelerator.startBPM);
    this.successCallback("Accelerator Settings Applied");
  }
  
  public toggleAccelerator() {
    this.acceleratorEnabled = !this.acceleratorEnabled;
    this.stop()
  }
}