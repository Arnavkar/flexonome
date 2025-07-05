export interface IBaseMetronome {
    bpm: number;
    isRunning: boolean;
    timeoutIds: number[];

    updateBpm:(newBpm: number) => void;
    
    successCallback: (message: string) => void;
    errorCallback: (message: string) => void;
    registerCallbacks(successCallback: (message: string) => void, errorCallback: (message: string) => void): void;
    start:() => void;
    stop:() => void;
    toggle:() => void;
    restart:() => void;
}
