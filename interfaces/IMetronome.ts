
export default interface IMetronome {
    bpm: number;
    isRunning: boolean;
    accelerator: Accelerator;
    acceleratorEnabled: boolean;
    
    successCallback: (message: string) => void;
    errorCallback: (message: string) => void;
    addCallbacks(successCallback: (message: string) => void, errorCallback: (message: string) => void): void;
    start:() => void;
    stop:() => void;
    toggle:() => void;
    restart:() => void;
    updateBpm:(newBpm: number) => void;
    
    toggleAccelerator:() => void;
    setAccelerator:(accelerator: Accelerator) => void;
}