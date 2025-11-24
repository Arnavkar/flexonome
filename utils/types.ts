export type Beat = {
    beatIndex: number;
    beatUnit: number;
    accent: number;
    interval?: number;
    bar?: number;
    subdivision: number;
    subdivisionEnabled: boolean[];
    tempo?: number;
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
    mode: 'automatic' | 'manual';
}

export type Errorhandler = (a: string) => void;

export type ParsedTimeSignature = {
    beats: Beat[];
    mainBeats: Beat[];
    countInBeats: Beat[];
    barTempos: (number | undefined)[];
}
