import type { IBaseMetronome } from "~/interfaces/IMetronome";

export default class BaseMetronome implements IBaseMetronome{
  public bpm: number = 120;
  public isRunning: boolean = false;
  public timeoutIds: number[] = [];

  public successCallback:(message:string) => void = (message:string) => console.log(message);
  public errorCallback: (message:string) => void = (message:string) => console.error(message);

  public addCallbacks(successCallback: (message:string) => void, errorCallback: (message:string) => void) {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
  }

  // Initialize the metronome by loading settings from localStorage
  public init(): void {
    this.loadSettings();
  }

  // Method to save settings to localStorage - to be overridden by subclasses
  public saveSettings(): void {
    // Base implementation - subclasses should override this
  }

  // Method to load settings from localStorage - to be overridden by subclasses
  public loadSettings(): void {
    // Base implementation - subclasses should override this
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
    if (!validateBPM(newBpm, this.errorCallback)) return;
    this.bpm = newBpm;
    this.saveSettings(); // Save settings after BPM update
  }
}