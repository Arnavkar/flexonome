import type { Accelerator } from "./utils/types";

export const themes = ['night', 'winter']; 

export const audioPaths:string[] = ['./Low.m4a', './Mid.m4a', './High.m4a', './Tic.m4a']

export const numBeatValues:number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Specific values for the top part of the time signature
export const beatUnitValues:number[] = [2, 4, 8, 16];

export const bpmIncrements:number[] = [1, 2, 3, 4,  5, 10, 15, 20, 25, 30];

export const defaultAccelerator:Accelerator = {
    numBarsToRepeat:4,
    bpmIncrement:5,
    startBPM:120,
    maxBpm:180,
    progress:0,
    mode:'automatic'
}