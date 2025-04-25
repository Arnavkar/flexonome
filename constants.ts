import type { Accelerator } from "./utils/types";

//Themes from Daisy UI (night for dark theme, winter for light theme)
export const themes = ['night', 'winter']; //Specific values for the bottom part of the time signature

export const audioPaths:string[] = ['./Low.m4a', './Mid.m4a', './High.m4a', './Tic.m4a']
export const bgColors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-gray-400'];
export const buttonWidthMap: Record<number, string> = {
    2: 'w-16',
    4: 'w-12',
    8: 'w-8',
    16: 'w-4'
}

export const numBeatValues:number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Specific values for the top part of the time signature
export const beatUnitValues:number[] = [2, 4, 8, 16];

export const bpmIncrements:number[] = [1, 2, 3, 4,  5, 10, 15, 20, 25, 30];

export const defaultAccelerator:Accelerator = {
    numBarsToRepeat:4,
    bpmIncrement:5,
    startBPM:120,
    maxBpm:180,
    progress:0
}