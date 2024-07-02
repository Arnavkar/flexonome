export type Beat = {
    beatIndex: number;
    beatUnit: number;
    interval: number;
}

export type TimeSignature = {
    numBeats: number;
    beats : Beat[];
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
}

export type Errorhandler = (a: string) => void;

