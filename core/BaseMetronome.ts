import type { IBaseMetronome } from "~/interfaces/IMetronome";

export default class BaseMetronome implements IBaseMetronome{
  public bpm: number = 120;
  public isRunning: boolean = false;
  public beats: Beat[] = parseTimeSignature('4/4', this.bpm);
  public accents: number[] = [1, 0, 0, 0];
  public activeBar: number = -1
  public timeoutIds: number[] = [];

  public successCallback:(message:string) => void = (message:string) => console.log(message);
  public errorCallback: (message:string) => void = (message:string) => console.error(message);

  public addCallbacks(successCallback: (message:string) => void, errorCallback: (message:string) => void) {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }
  public start(){
    if (this.isRunning) return;
    this.isRunning = true;
  }

  public stop() {
    if (!this.isRunning) return;
    if (this.timeoutIds.length > 0) {
      this.timeoutIds.forEach(id => clearTimeout(id));
      this.timeoutIds = [];
    }
    this.isRunning = false;
    this.activeBar = -1;
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
  
}