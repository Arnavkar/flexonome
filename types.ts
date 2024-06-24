export type Beat = {
    beatIndex: number;
    beatUnit: number;
    interval: number;
}

export type TimeSignature = {
    totalBeats: number;
    beats : Beat[];
}

