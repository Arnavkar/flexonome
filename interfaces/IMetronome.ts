export interface IBaseMetronome {
    bpm: number;
    isRunning: boolean;
    
    successCallback: (message: string) => void;
    errorCallback: (message: string) => void;
    addCallbacks(successCallback: (message: string) => void, errorCallback: (message: string) => void): void;
    start:() => void;
    stop:() => void;
    toggle:() => void;
    restart:() => void;
}

export interface IMetronome {
    accelerator: Accelerator;
    acceleratorEnabled: boolean;

    updateBpm:(newBpm: number) => void;
    updateTimeSignature:(inputString: string) => void;
    toggleAccelerator:() => void;
    setAccelerator:(accelerator: Accelerator) => void;
}