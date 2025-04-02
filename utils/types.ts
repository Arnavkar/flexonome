export type Beat = {
    beatIndex: number;
    beatUnit: number;
    accent: number;
    interval?: number;
    bar?: number;
}

export type Polyrhythm = {
    ratios: number[];
    intervals: number[];    
}

export type Accelerator = {
    numBarsToRepeat: number;
    bpmIncrement: number;
    maxBpm: number;
    startBPM: number;
    progress: number;
}

export type Errorhandler = (a: string) => void;

