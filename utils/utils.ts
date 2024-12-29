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

  // Validate the input
  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('Invalid input: Input should be a non-empty string.');
  }

  const sections = input.split('&');
  let currentBeatIndex = 0;

  sections.forEach(section => {
    const matches = section.match(/(\((\d+)\/(\d+)\)\*(\d+)|(\d+)\/(\d+))/g);

    if (!matches) {
      throw new Error(`Invalid format in section: ${section}`);
    }

    matches.forEach(match => {
      let numBeats, beatUnit, repeat = 1;

      if (match.includes('(')) {
        const parts = match.match(/\((\d+)\/(\d+)\)\*(\d+)/);
        if (!parts || parts.length !== 4) {
          throw new Error(`Invalid time signature format: ${match}`);
        }
        numBeats = parseInt(parts[1], 10);
        beatUnit = parseInt(parts[2], 10);
        repeat = parseInt(parts[3], 10);
      } else {
        const parts = match.match(/(\d+)\/(\d+)/);
        if (!parts || parts.length !== 3) {
          throw new Error(`Invalid time signature format: ${match}`);
        }
        numBeats = parseInt(parts[1], 10);
        beatUnit = parseInt(parts[2], 10);
      }

      if (isNaN(numBeats) || isNaN(beatUnit) || isNaN(repeat)) {
        throw new Error(`Invalid numbers in time signature: ${match}`);
      }

      for (let i = 0; i < repeat; i++) {
        for (let j = 0; j < numBeats; j++) {
          beats.push({
            beatIndex: currentBeatIndex,
            beatUnit: beatUnit,
            accent: j === 0 ? 1 : 0
          } as Beat);
          currentBeatIndex++;
        }
      }
    });
  });
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

export const isMobile = (): boolean => {
  if(/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
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