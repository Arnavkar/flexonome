import Accelerator from "./components/AcceleratorInput.vue";

export type Beat = {
    beatIndex: number;
    beatUnit: number;
    interval: number;
}

export type TimeSignature = {
    numBeats: number;
    beats : Beat[];
}

export type Accelerator = {
    numBarsToRepeat: number;
    bpmIncrement: number;
    maxBpm: number;
    startBPM: number;
}
