import type { TimeSignature, Accelerator } from '../utils/types';
import { parseTimeSignature, validateBPM } from '~/utils/utils';
import { defaultAccelerator } from '~/constants';
import type IMetronome  from '~/interfaces/IMetronome';

export default class Metronome implements IMetronome {
  public bpm: number = 120;
  public isRunning: boolean = false;
  public timeSignature: TimeSignature = parseTimeSignature('4/4', this.bpm);
  public beatUnit: number[] = [4, 4, 4, 4];
  public accents: number[] = [1, 0, 0, 0];
  public activeBar: number = -2
  private timeoutIds: number[] = [];

  public acceleratorOptions: Accelerator = defaultAccelerator;
  public acceleratorEnabled: boolean = false;
  public acceleratorProgress: number = 0;

  public drift: number = 0;

  public successCallback:(message:string) => void = (message:string) => console.log(message);
  public errorCallback: (message:string) => void = (message:string) => console.error(message);

  public addCallbacks(successCallback: (message:string) => void, errorCallback: (message:string) => void) {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }

  public get numBeats(): number {
    return this.beatUnit.length;
  }

  public start(){
    const beats = this.timeSignature.beats;
    let currentBeatIndex = 0;
    let currentBeatInAcceleratorLoop = 0;
    let numBeatsBeforeIncrement = 0;
    const start = Date.now()
    let totalTime = 0;

    if (this.acceleratorEnabled) {
      numBeatsBeforeIncrement = beats.length * this.acceleratorOptions.numBarsToRepeat + 1;
    }

    const tic = () => {
      const currentBeat = beats[currentBeatIndex];
      const timeDrift = Math.max((new Date().getTime() - start) - totalTime, 0);
      this.drift = timeDrift;

      this.activeBar = currentBeat.beatIndex;
      // You can add a sound or click here
      currentBeatIndex = (currentBeatIndex + 1) % beats.length;

      const timeoutId = window.setTimeout(tic, currentBeat.interval ? currentBeat.interval - timeDrift : 1000)
      this.timeoutIds.push(timeoutId);
      totalTime += currentBeat.interval;

      if (this.acceleratorEnabled) {
        currentBeatInAcceleratorLoop = (currentBeatInAcceleratorLoop + 1) % numBeatsBeforeIncrement;
        this.acceleratorProgress = Math.floor((currentBeatInAcceleratorLoop / (numBeatsBeforeIncrement - 1)) * 100)
        if (currentBeatInAcceleratorLoop == 0) {
          this.updateBpm(Math.min(this.acceleratorOptions.maxBpm, this.bpm + this.acceleratorOptions.bpmIncrement));
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
    this.acceleratorProgress = 0;
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
    this.timeSignature.beats.forEach(beat => {
      beat.interval = (60 / newBpm) * 1000 / (beat.beatUnit / 4);
    });
    if (this.isRunning == true) {
      this.restart();
    }
  }

  public updateNumBeats(newNumBeats: number) {
    this.beatUnit = Array(newNumBeats).fill(this.beatUnit[0]);
    this.timeSignature = parseTimeSignature(`${this.numBeats}/${this.beatUnit[0]}`, this.bpm);
    if (this.isRunning == true) {
      this.restart();
    }
  }

  public updateBeatUnit(newBeatUnit: number) {
    this.beatUnit = Array(this.numBeats).fill(newBeatUnit);
    this.timeSignature = parseTimeSignature(`${this.numBeats}/${this.beatUnit[0]}`, this.bpm);
    if (this.isRunning == true) {
      // Restart the metronome with the new BPM
      this.restart();
    }
  }

  public updateMultipleTimeSignature(inputString: string) {
    try {
      this.timeSignature = parseTimeSignature(inputString, this.bpm);
      this.beatUnit = this.timeSignature.beats.map((beat: Beat) => beat.beatUnit)
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
    this.accents = this.timeSignature.beats.map((beat:Beat) => beat.isFirst? 1:0);
  }

  public setAcceleratorOptions(accelerator: Accelerator) {
    if (!validateAccelerator(accelerator,this.errorCallback)) return;
    this.stop();
    this.acceleratorOptions = accelerator;
    this.updateBpm(accelerator.startBPM);
    this.successCallback("Accelerator settings applied");
  }
  
  public toggleAccelerator() {
    this.acceleratorEnabled = !this.acceleratorEnabled;
    this.stop()
  }
}