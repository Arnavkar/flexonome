import type { Accelerator } from '../utils/types';
import { parseTimeSignature, validateBPM } from '../utils/utils';
import { defaultAccelerator } from '~/constants';
import type IMetronome  from '../interfaces/IMetronome';

export default class Metronome implements IMetronome {
  public bpm: number = 120;
  public isRunning: boolean = false;
  public beats: Beat[] = parseTimeSignature('4/4', this.bpm);
  public accents: number[] = [1, 0, 0, 0];
  public activeBar: number = -2
  public timeoutIds: number[] = [];

  public accelerator: Accelerator = defaultAccelerator;
  public acceleratorEnabled: boolean = false;

  public drift: number = 0;

  public successCallback:(message:string) => void = (message:string) => console.log(message);
  public errorCallback: (message:string) => void = (message:string) => console.error(message);

  public addCallbacks(successCallback: (message:string) => void, errorCallback: (message:string) => void) {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }

  public get numBeats(): number {
    return this.beats.length;
  }

  public get beatUnit(): number[] {
    return this.beats.map((beat: Beat) => beat.beatUnit);
  }

  public start(){
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

      const timeoutId = window.setTimeout(tic, currentBeat.interval ? currentBeat.interval - timeDrift : 1000)
      this.timeoutIds.push(timeoutId);
      totalTime += currentBeat.interval;

      if (this.acceleratorEnabled) {
        currentBeatInAcceleratorLoop = (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
        this.accelerator.progress = Math.floor((currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement - 1)) * 100)
        if (currentBeatInAcceleratorLoop == 0) {
          this.updateBpm(Math.min(this.accelerator.maxBpm, this.bpm + this.accelerator.bpmIncrement));
        }
      }
    }
    
    if (!this.isRunning) {
      tic()
      this.isRunning = true;
    }
  }

  public stop() {
    if (this.timeoutIds.length > 0) {
      this.timeoutIds.forEach(id => clearTimeout(id));
      this.timeoutIds = [];
    }
    this.isRunning = false;
    this.activeBar = -2;
    this.accelerator.progress = 0;
  }

  public toggle() {
    if (!validateBPM(this.bpm, this.errorCallback)) return;
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  public restart() {
    this.stop();
    this.start();
  }

  public updateBpm(newBpm: number) {
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
      this.beats = parseTimeSignature(inputString, this.bpm);
      this.setAccents();
      this.successCallback("Multiple time signature applied");
    } catch (e) {
      this.errorCallback((e as Error).message);
    }
    
    if (this.isRunning == true) {
      this.restart();
    }
  };

  public setAccents(){
    this.accents = this.beats.map((beat:Beat) => beat.isFirst? 1:0);
  }

  public setAccelerator(accelerator: Accelerator) {
    if (!validateAccelerator(accelerator,this.errorCallback)) return;
    this.stop();
    this.accelerator = accelerator;
    this.updateBpm(accelerator.startBPM);
    this.successCallback("Accelerator settings applied");
  }
  
  public toggleAccelerator() {
    this.acceleratorEnabled = !this.acceleratorEnabled;
    this.stop()
  }
}