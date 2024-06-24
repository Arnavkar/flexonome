export type Beat = {
    beatIndex: number;
    beatUnit: number;
    interval: number;
}

export type TimeSignature = {
    numBeats: number;
    beats : Beat[];
}

