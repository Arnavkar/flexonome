export interface IBaseMetronome {
    bpm: number;
    isRunning: boolean;
    timeoutIds: number[];
    
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
    toggleAccelerator:() => void;
    setAccelerator:(accelerator: Accelerator) => void;
}