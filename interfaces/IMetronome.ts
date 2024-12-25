
export default interface IMetronome {
    bpm: number;
    isRunning: boolean;
    timeSignature: TimeSignature;
    beatUnit: number[];
    accents: number[];
    activeBar: number;
    acceleratorOptions: Accelerator;
    acceleratorEnabled: boolean;
    acceleratorProgress: number;
    
    successCallback: (message: string) => void;
    errorCallback: (message: string) => void;
    addCallbacks(successCallback: (message: string) => void, errorCallback: (message: string) => void): void;
    start:() => void;
    stop:() => void;
    toggle:() => void;
    restart:() => void;
    updateBpm:(newBpm: number) => void;
    updateNumBeats:(newNumBeats: number) => void;
    updateBeatUnit:(newBeatUnit: number) => void;
    updateMultipleTimeSignature:(inputString: string) => void;
    setAccents:() => void;
    setAcceleratorOptions:(accelerator: Accelerator) => void;
    toggleAccelerator:() => void;
}