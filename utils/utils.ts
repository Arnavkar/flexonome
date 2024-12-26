import type { Beat, Polyrhythm, Errorhandler } from './types';


export function validateBPM(bpm_value:number, errorHandler?: Errorhandler):boolean{
  const errorHandlerFunc = errorHandler ?? console.error;
  if (bpm_value < 20 || bpm_value > 300) {
    errorHandlerFunc("BPM must be between 20 and 300");
    return false;
  }
  return true;
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

export function parseTimeSignature(input:string, bpm:number): Beat[] {
  const result: Beat[] = []

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
          const interval = (60 / bpm) * 1000 / (beatUnit / 4);
          result.push({
            beatIndex: currentBeatIndex,
            beatUnit: beatUnit,
            interval: interval,
            isFirst: j === 0
          });
          currentBeatIndex++;
        }
      }
    });
  });
  return result;
}

export function constructPolyrhythm(ratio_1: number, ratio_2: number, bpm: number): Polyrhythm {
  const totalTime = (60000 / bpm) * Math.min(ratio_1, ratio_2); // Total time span for one cycle of the polyrhythm in milliseconds

  // Calculate intervals for each ratio
  const interval_1 = totalTime / ratio_1;
  const interval_2 = totalTime / ratio_2;

  return {
      ratios: [ratio_1, ratio_2],
      intervals: [interval_1, interval_2]
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
    throw new Error(`Failed to fetch audio file: ${filePath}`);
  } else {
    console.log(`Successfully fetched audio file: ${filePath}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);

  // const sampleRate = audioBuffer.sampleRate;
  // const frameCount = Math.min(audioBuffer.length, sampleRate * duration);

  // const newBuffer = audioContext.createBuffer(
  //   audioBuffer.numberOfChannels,
  //   frameCount,
  //   sampleRate
  // );

  // for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
  //   const oldData = audioBuffer.getChannelData(channel);
  //   const newData = newBuffer.getChannelData(channel);
  //   newData.set(oldData.subarray(0, frameCount));
  // }

  // return newBuffer;
};