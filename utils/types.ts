export type Beat = {
    beatIndex: number;
    beatUnit: number;
    interval: number;
    isFirst: boolean;
}

export type BeatV2 = {
    beatIndex: number;
    beatUnit: number;
    time: number;
    isFirst: boolean;
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

