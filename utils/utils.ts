import type { Beat, Polyrhythm, Errorhandler } from './types';

export function validateBPM(bpm_value:number, errorHandler?: Errorhandler):boolean{
  const errorHandlerFunc = errorHandler ?? console.error;
  if (bpm_value < 20 || bpm_value > 300) {
    errorHandlerFunc("BPM must be between 20 and 300");
    return false;
  } else {
    return true;
  }
};

export function validateAccelerator(accelerator:Accelerator, errorHandler?: Errorhandler):boolean{
  const errorHandlerFunc = errorHandler || console.error;
  
  if (accelerator.startBPM < 20 || accelerator.startBPM > 280){
    errorHandlerFunc("Starting BPM must be between 20 and 280");
    return false;
  }
  if (accelerator.maxBpm < 40 || accelerator.maxBpm > 300){
    errorHandlerFunc("Max BPM must be between 40 and 300");
    return false;
  }
  if (accelerator.startBPM > accelerator.maxBpm){
    errorHandlerFunc("Starting BPM must be less than Max BPM");
    return false;
  }
  return true;
}

export function parseTimeSignature(input:string): Beat[] {
  const beats: Beat[] = []
  const countInBeats: Beat[] = []

  // Validate the input
  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('Invalid input: Input should be a non-empty string.');
  }

  const sections = input.split('&');
  let currentBeatIndex = 0;
  let currentBar = 1;

  sections.forEach(section => {
    // Updated regex to handle both n*(num/den) and num[sub]/den formats
    // Case 1: ci(num[sub]/den)
    // Case 2: n*(num[sub]/den)
    // Case 3: (num[sub]/den)
    // Case 4: num[sub]/den
    const matches = section.match(/((?:ci)?\((\d+)(?:\[(\d+)\])?\/(\d+)\)|(\d+)\*\((\d+)(?:\[(\d+)\])?\/(\d+)\)|(\d+)(?:\[(\d+)\])?\/(\d+))/gi);

    if (!matches) {
      throw new Error(`Invalid format in section: ${section}`);
    }

    matches.forEach(match => {
      const lowerMatch = match.toLowerCase();
      const isCountIn = lowerMatch.startsWith('ci(');
      let numBeats: number, beatUnit: number, repeat = 1, subdivision = 1;

      // Match for multiplier format: n*(num/den) or n*(num[sub]/den)
      if (lowerMatch.includes('*')) {
        const parts = match.match(/(\d+)\*\((\d+)(?:\[(\d+)\])?\/(\d+)\)/i);
        if (!parts) {
          throw new Error(`Invalid multiplier format: ${match}`);
        }
        repeat = parseInt(parts[1], 10);
        numBeats = parseInt(parts[2], 10);
        subdivision = parts[3] ? parseInt(parts[3], 10) : 1;
        beatUnit = parseInt(parts[4], 10);
      }
      // Match for count-in: ci(num/den) or ci(num[sub]/den)
      else if (isCountIn) {
        const parts = match.match(/ci\((\d+)(?:\[(\d+)\])?\/(\d+)\)/i);
        if (!parts) {
          throw new Error(`Invalid count-in format: ${match}`);
        }
        numBeats = parseInt(parts[1], 10);
        subdivision = parts[2] ? parseInt(parts[2], 10) : 1;
        beatUnit = parseInt(parts[3], 10);
      } 
      // Match for parenthesized: (num/den) or (num[sub]/den)
      else if (match.startsWith('(')) {
        const parts = match.match(/\((\d+)(?:\[(\d+)\])?\/(\d+)\)/);
        if (!parts) {
          throw new Error(`Invalid time signature format: ${match}`);
        }
        numBeats = parseInt(parts[1], 10);
        subdivision = parts[2] ? parseInt(parts[2], 10) : 1;
        beatUnit = parseInt(parts[3], 10);
      } 
      // Match for simple: num/den or num[sub]/den
      else {
        const parts = match.match(/(\d+)(?:\[(\d+)\])?\/(\d+)/);
        if (!parts) {
          throw new Error(`Invalid time signature format: ${match}`);
        }
        numBeats = parseInt(parts[1], 10);
        subdivision = parts[2] ? parseInt(parts[2], 10) : 1;
        beatUnit = parseInt(parts[3], 10);
      }

      if (isNaN(numBeats) || isNaN(beatUnit) || isNaN(repeat) || isNaN(subdivision)) {
        throw new Error(`Invalid numbers in time signature: ${match}`);
      }

      for (let i = 0; i < repeat; i++) {
        if (isCountIn) {
          for (let j = 0; j < numBeats; j++) {
            countInBeats.push({
              beatIndex: 0, // Temporary value, will be updated after all count-in beats are collected
              beatUnit,
              accent: 3,
              bar: -1,
              subdivision: subdivision,
              subdivisionEnabled: Array(Math.max(0, subdivision - 1)).fill(true)
            } as Beat);
          }
        } else {
          for (let j = 0; j < numBeats; j++) {
            beats.push({
              beatIndex: currentBeatIndex++,
              beatUnit: beatUnit,
              accent: j === 0 ? 1 : 0,
              bar: currentBar,
              subdivision: subdivision,
              subdivisionEnabled: Array(Math.max(0, subdivision - 1)).fill(true)
            } as Beat);
          }
          currentBar++;
        }
      }
    });
  });

  // Assign negative indices to count-in beats, counting backward from total length
  if (countInBeats.length > 0) {
    // Check if there are only count-in beats and no regular beats
    if (beats.length === 0) {
      throw new Error("Invalid time signature: Cannot have only count-in bars without regular bars");
    }
    
    for (let i = 0; i < countInBeats.length; i++) {
      countInBeats[i].beatIndex = -(countInBeats.length - i);
    }
    
    // Prepend count-in beats to the main beats array
    beats.unshift(...countInBeats);
  }

  console.log(beats);
  return beats;
}

export function constructPolyrhythm(ratios:number[], bpm: number, selected:number): Polyrhythm {
  let totalTime = (60 / bpm);
  if (selected === 0){
    totalTime *= ratios[0] // Total time span for one cycle of the polyrhythm in seconds
  } else {
    totalTime *= ratios[1]
  }

  return {
      ratios: ratios,
      intervals: [totalTime / ratios[0], totalTime / ratios[1]]
  };
}

export const loadAudioBuffer = async (filePath: string, audioContext: AudioContext): Promise<AudioBuffer> => {
  const response = await fetch(filePath);
  if (!response.ok) {
    console.error(`Failed to fetch audio file: ${filePath}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

export function playSound(buffer: AudioBuffer, audioContext: AudioContext, time: number) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(time);
}

export async function setUpAudioBuffers(audioContext: AudioContext, audioPaths: string[]): Promise<AudioBuffer[]> {
  const audioBuffers = await Promise.all(audioPaths.map(async (path) => {
      return await loadAudioBuffer(path, audioContext!);
  }));
  return audioBuffers;
}

export function getUniqueBeatUnitValues(numList:number[]) {
  return [...new Set(numList)].sort((a, b) => a - b).join('|');
}

export function showModalById(id:string) {
  const modal = document.getElementById(id);
  if (modal) (modal as HTMLDialogElement).showModal();
}