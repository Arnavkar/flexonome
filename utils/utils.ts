import type { Beat, Polyrhythm, Errorhandler, ParsedTimeSignature } from './types';

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

// Calculate button width based on beat unit
// The smaller the beat unit value, the wider the button
export function calculateButtonWidth(beatUnit: number): string {
  // Base sizes in pixels
  const minWidth = 20; // Width for largest beat unit value (e.g., 32nd note) in pixels
  const maxWidth = 70; // Width for smallest beat unit value (e.g., whole note) in pixels
  
  // Map from 2 (whole) to 32 (thirty-second note)
  const minBeatUnit = 2;
  const maxBeatUnit = 16;
  
  // Normalize and invert the beat unit (smaller beat unit = larger width)
  // We use logarithmic scale to better distribute the widths
  const normalizedValue = Math.max(0, Math.min(1, 
      Math.log(maxBeatUnit / Math.max(minBeatUnit, Math.min(maxBeatUnit, beatUnit))) / 
      Math.log(maxBeatUnit / minBeatUnit)
  ));
  
  // Calculate the width based on the normalized value
  const width = minWidth + normalizedValue * (maxWidth - minWidth);
  
  // Round to nearest pixel
  const pixelValue = Math.round(width);
  
  return `width: ${pixelValue}px`;
}

export type TimeSignatureParserOptions = {
  defaultRampBars?: number;
  minTempo?: number;
  maxTempo?: number;
};

type TempoSpec =
  | { kind: 'constant'; value: number }
  | { kind: 'ramp'; start: number; end: number; bars?: number }
  | { kind: 'modulation'; currentBeats: number; referenceBeats: number };

type TempoInstruction =
  | { type: 'absolute'; value: number }
  | { type: 'modulation'; currentBeats: number; referenceBeats: number }
  | { type: 'inherit' }
  | { type: 'none' };

class TimeSignatureParserInternal {
  private countInBeats: Beat[] = [];
  private mainBeats: Beat[] = [];
  private combinedBeats: Beat[] = [];
  private barTempos: (number | undefined)[] = [];
  private currentBeatIndex = 0;
  private currentBar = 1;
  private lastMainBarTempo: number | undefined;

  private readonly defaultRampBars: number;
  private readonly minTempo: number;
  private readonly maxTempo: number;

  private static readonly TIME_TOKEN_REGEX =
    /(?:ci)?\(\d+(?:\[\d+\])?\/\d+\)|\d+\*\(\d+(?:\[\d+\])?\/\d+\)|\(\d+(?:\[\d+\])?\/\d+\)|\d+(?:\[\d+\])?\/\d+/gi;

  constructor(options: TimeSignatureParserOptions = {}) {
    this.defaultRampBars = options.defaultRampBars ?? 4;
    this.minTempo = options.minTempo ?? 20;
    this.maxTempo = options.maxTempo ?? 300;
  }

  public parse(input: string): ParsedTimeSignature {
    this.resetState();

    if (typeof input !== 'string' || input.trim() === '') {
      throw new Error('Invalid input: Input should be a non-empty string.');
    }

    const sections = input.split('&');
    sections.forEach((rawSection) => {
      const section = rawSection.trim();
      if (!section) {
        throw new Error('Invalid time signature: Empty section detected.');
      }
      this.parseSection(section);
    });

    this.finalizeBeats();

    return {
      beats: [...this.combinedBeats],
      mainBeats: [...this.mainBeats],
      countInBeats: [...this.countInBeats],
      barTempos: [...this.barTempos],
    };
  }

  private resetState(): void {
    this.countInBeats = [];
    this.mainBeats = [];
    this.combinedBeats = [];
    this.barTempos = [];
    this.currentBeatIndex = 0;
    this.currentBar = 1;
    this.lastMainBarTempo = undefined;
  }

  private parseSection(section: string): void {
    const tokenRegex = new RegExp(TimeSignatureParserInternal.TIME_TOKEN_REGEX);
    let match: RegExpExecArray | null;
    let foundAny = false;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(section)) !== null) {
      foundAny = true;
      const gap = section.slice(lastIndex, match.index);
      if (gap.trim()) {
        throw new Error(`Invalid format in section: ${section}`);
      }

      const timePart = match[0];
      const tempoExtraction = this.extractTempoSpec(section, tokenRegex.lastIndex);
      tokenRegex.lastIndex = tempoExtraction.nextIndex;
      this.processMatch(timePart, tempoExtraction.spec);
      lastIndex = tokenRegex.lastIndex;
    }

    const trailing = section.slice(lastIndex);
    if (!foundAny || trailing.trim()) {
      throw new Error(`Invalid format in section: ${section}`);
    }
  }

  private extractTempoSpec(section: string, startIndex: number): { spec?: TempoSpec; nextIndex: number } {
    const length = section.length;
    let index = startIndex;

    while (index < length && /\s/.test(section[index] ?? '')) {
      index++;
    }

    if (index >= length || section[index] !== '@') {
      return { nextIndex: index };
    }

    index++; // Skip '@'

    while (index < length && /\s/.test(section[index] ?? '')) {
      index++;
    }

    if (index >= length) {
      throw new Error('Invalid tempo specification: Missing value after "@".');
    }

    const remaining = section.slice(index);
    const lowerRemaining = remaining.toLowerCase();

    if (lowerRemaining.startsWith('mod')) {
      index += 3; // Skip 'mod'
      while (index < length && /\s/.test(section[index] ?? '')) {
        index++;
      }
      if (index >= length || section[index] !== '(') {
        throw new Error('Invalid metric modulation syntax: Expected parentheses after "@mod".');
      }
      const { value, nextIndex } = this.readParenthesized(section, index);
      const spec = this.parseModulationSpec(value);
      let cursor = nextIndex;
      while (cursor < length && /\s/.test(section[cursor] ?? '')) {
        cursor++;
      }
      return { spec, nextIndex: cursor };
    }

    if (section[index] === '(') {
      const { value, nextIndex } = this.readParenthesized(section, index);
      const spec = this.parseTempoRampSpec(value);
      let cursor = nextIndex;
      while (cursor < length && /\s/.test(section[cursor] ?? '')) {
        cursor++;
      }
      return { spec, nextIndex: cursor };
    }

    const numberMatch = section.slice(index).match(/^[+-]?\d+(?:\.\d+)?/);
    if (!numberMatch) {
      throw new Error(`Invalid tempo specification near "${section.slice(index).trim()}".`);
    }

    const numericValue = Number(numberMatch[0]);
    this.ensureTempoInRange(numericValue);
    index += numberMatch[0].length;

    while (index < length && /\s/.test(section[index] ?? '')) {
      index++;
    }

    return { spec: { kind: 'constant', value: numericValue }, nextIndex: index };
  }

  private readParenthesized(section: string, openIndex: number): { value: string; nextIndex: number } {
    if (section[openIndex] !== '(') {
      throw new Error('Internal parser error: Expected opening parenthesis.');
    }

    const length = section.length;
    let depth = 0;
    let index = openIndex;
    const start = openIndex + 1;

    while (index < length) {
      const char = section[index];
      if (char === '(') {
        depth++;
      } else if (char === ')') {
        depth--;
        if (depth === 0) {
          const value = section.slice(start, index);
          return { value, nextIndex: index + 1 };
        }
      }
      index++;
    }

    throw new Error('Invalid tempo specification: Unmatched parentheses.');
  }

  private parseTempoRampSpec(content: string): TempoSpec {
    const parts = content
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (parts.length === 0) {
      throw new Error('Tempo ramp specification cannot be empty.');
    }

    const numbers = parts.map((value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        throw new Error(`Invalid tempo value: ${value}`);
      }
      return numeric;
    });

    if (numbers.length === 1) {
      this.ensureTempoInRange(numbers[0]);
      return { kind: 'constant', value: numbers[0] };
    }

    if (numbers.length === 2) {
      numbers.slice(0, 2).forEach((value) => this.ensureTempoInRange(value));
      return { kind: 'ramp', start: numbers[0], end: numbers[1] };
    }

    if (numbers.length === 3) {
      numbers.slice(0, 2).forEach((value) => this.ensureTempoInRange(value));
      return { kind: 'ramp', start: numbers[0], end: numbers[1], bars: numbers[2] };
    }

    throw new Error(`Tempo ramp specification must have 1, 2, or 3 values: (${content})`);
  }

  private parseModulationSpec(content: string): TempoSpec {
    const cleaned = content.trim();
    if (!cleaned) {
      throw new Error('Metric modulation specification cannot be empty.');
    }

    const parts = cleaned
      .split(/[:=,\/]/)
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (parts.length !== 2) {
      throw new Error(`Metric modulation must specify two values, e.g., @mod(6:4). Received: (${content})`);
    }

    const currentBeats = Number(parts[0]);
    const referenceBeats = Number(parts[1]);

    if (!Number.isFinite(currentBeats) || !Number.isFinite(referenceBeats)) {
      throw new Error(`Metric modulation values must be numeric in (${content}).`);
    }
    if (currentBeats <= 0 || referenceBeats <= 0) {
      throw new Error(`Metric modulation values must be positive in (${content}).`);
    }

    return { kind: 'modulation', currentBeats, referenceBeats };
  }

  private processMatch(timePart: string, tempoSpec?: TempoSpec): void {
    const { isCountIn, repeat, numBeats, beatUnit, subdivision } =
      this.extractTimeSignatureComponents(timePart);

    const tempoInstructions = this.buildTempoInstructions(tempoSpec, repeat);

    for (let iteration = 0; iteration < repeat; iteration++) {
      const instruction = tempoInstructions[iteration] ?? { type: 'none' as const };

      if (isCountIn) {
        if (instruction.type === 'modulation') {
          throw new Error('Metric modulation cannot be applied to count-in bars.');
        }
        const tempo = this.resolveTempo(instruction, 'countIn');
        this.addCountInBar(numBeats, beatUnit, subdivision, tempo);
        continue;
      }

      const tempo = this.resolveTempo(instruction, 'main');
      this.addRegularBar(numBeats, beatUnit, subdivision, tempo);
    }
  }

  private extractTimeSignatureComponents(timePart: string): {
    isCountIn: boolean;
    repeat: number;
    numBeats: number;
    beatUnit: number;
    subdivision: number;
  } {
    const trimmed = timePart.trim();
    const lower = trimmed.toLowerCase();
    let repeat = 1;
    let isCountIn = false;
    let numBeats = 0;
    let beatUnit = 0;
    let subdivision = 1;

    if (lower.startsWith('ci(')) {
      isCountIn = true;
      const parts = trimmed.match(/ci\(\s*(\d+)(?:\s*\[(\d+)\])?\s*\/\s*(\d+)\s*\)/i);
      if (!parts) {
        throw new Error(`Invalid count-in format: ${timePart}`);
      }
      numBeats = parseInt(parts[1], 10);
      subdivision = parts[2] ? parseInt(parts[2], 10) : 1;
      beatUnit = parseInt(parts[3], 10);
    } else if (lower.includes('*')) {
      const parts = trimmed.match(/(\d+)\s*\*\s*\(\s*(\d+)(?:\s*\[(\d+)\])?\s*\/\s*(\d+)\s*\)/i);
      if (!parts) {
        throw new Error(`Invalid multiplier format: ${timePart}`);
      }
      repeat = parseInt(parts[1], 10);
      numBeats = parseInt(parts[2], 10);
      subdivision = parts[3] ? parseInt(parts[3], 10) : 1;
      beatUnit = parseInt(parts[4], 10);
    } else if (trimmed.startsWith('(')) {
      const parts = trimmed.match(/\(\s*(\d+)(?:\s*\[(\d+)\])?\s*\/\s*(\d+)\s*\)/);
      if (!parts) {
        throw new Error(`Invalid time signature format: ${timePart}`);
      }
      numBeats = parseInt(parts[1], 10);
      subdivision = parts[2] ? parseInt(parts[2], 10) : 1;
      beatUnit = parseInt(parts[3], 10);
    } else {
      const parts = trimmed.match(/(\d+)(?:\s*\[(\d+)\])?\s*\/\s*(\d+)/);
      if (!parts) {
        throw new Error(`Invalid time signature format: ${timePart}`);
      }
      numBeats = parseInt(parts[1], 10);
      subdivision = parts[2] ? parseInt(parts[2], 10) : 1;
      beatUnit = parseInt(parts[3], 10);
    }

    if (
      !Number.isFinite(numBeats) ||
      !Number.isFinite(beatUnit) ||
      !Number.isFinite(repeat) ||
      !Number.isFinite(subdivision)
    ) {
      throw new Error(`Invalid numbers in time signature: ${timePart}`);
    }

    if (repeat < 1) {
      throw new Error(`Repeat count must be at least 1 in: ${timePart}`);
    }
    if (numBeats < 1 || beatUnit < 1 || subdivision < 1) {
      throw new Error(`Time signature values must be positive integers: ${timePart}`);
    }

    return {
      isCountIn,
      repeat,
      numBeats,
      beatUnit,
      subdivision,
    };
  }

  private buildTempoInstructions(tempoSpec: TempoSpec | undefined, repeat: number): TempoInstruction[] {
    if (repeat <= 0) {
      return [];
    }

    if (!tempoSpec) {
      return Array.from({ length: repeat }, () => ({ type: 'none' as const }));
    }

    if (tempoSpec.kind === 'constant') {
      this.ensureTempoInRange(tempoSpec.value);
      return Array.from({ length: repeat }, () => ({
        type: 'absolute' as const,
        value: tempoSpec.value,
      }));
    }

    if (tempoSpec.kind === 'ramp') {
      let barsToRamp = tempoSpec.bars ?? this.defaultRampBars;
      if (!Number.isFinite(barsToRamp) || barsToRamp < 1) {
        throw new Error(`Tempo ramp bars must be a positive integer: ${tempoSpec.bars}`);
      }
      barsToRamp = Math.max(1, Math.trunc(barsToRamp));

      const { start, end } = tempoSpec;
      const step = barsToRamp === 1 ? 0 : (end - start) / (barsToRamp - 1);

      return Array.from({ length: repeat }, (_, index) => {
        let tempo: number;
        if (index < barsToRamp) {
          tempo = barsToRamp === 1 ? end : start + step * index;
        } else {
          tempo = end;
        }
        this.ensureTempoInRange(tempo);
        return { type: 'absolute' as const, value: tempo };
      });
    }

    const modulationInstructions: TempoInstruction[] = [
      {
        type: 'modulation',
        currentBeats: tempoSpec.currentBeats,
        referenceBeats: tempoSpec.referenceBeats,
      },
    ];

    for (let i = 1; i < repeat; i++) {
      modulationInstructions.push({ type: 'inherit' });
    }

    return modulationInstructions;
  }

  private resolveTempo(instruction: TempoInstruction, context: 'main' | 'countIn'): number | undefined {
    if (instruction.type === 'none') {
      return undefined;
    }

    if (instruction.type === 'absolute') {
      this.ensureTempoInRange(instruction.value);
      if (context === 'main') {
        this.lastMainBarTempo = instruction.value;
      }
      return instruction.value;
    }

    if (instruction.type === 'inherit') {
      if (context === 'main') {
        if (this.lastMainBarTempo === undefined) {
          throw new Error('Cannot inherit tempo before one has been defined.');
        }
        return this.lastMainBarTempo;
      }
      return undefined;
    }

    if (context === 'countIn') {
      throw new Error('Metric modulation cannot be applied to count-in bars.');
    }

    if (this.lastMainBarTempo === undefined) {
      throw new Error('Metric modulation requires a previously defined bar tempo.');
    }

    const tempo = this.lastMainBarTempo * (instruction.currentBeats / instruction.referenceBeats);
    this.ensureTempoInRange(tempo);
    this.lastMainBarTempo = tempo;
    return tempo;
  }

  private ensureTempoInRange(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error('Tempo must be a finite number.');
    }
    if (value < this.minTempo || value > this.maxTempo) {
      throw new Error(`Tempo ${value} is out of supported range ${this.minTempo}-${this.maxTempo}.`);
    }
  }

  private addCountInBar(
    numBeats: number,
    beatUnit: number,
    subdivision: number,
    tempo: number | undefined,
  ): void {
    for (let j = 0; j < numBeats; j++) {
      this.countInBeats.push({
        beatIndex: 0,
        beatUnit,
        accent: 3,
        bar: -1,
        subdivision,
        subdivisionEnabled: Array(Math.max(0, subdivision - 1)).fill(true),
        tempo,
      });
    }
  }

  private addRegularBar(
    numBeats: number,
    beatUnit: number,
    subdivision: number,
    tempo: number | undefined,
  ): void {
    const barNumber = this.currentBar;
    this.barTempos.push(tempo);

    for (let j = 0; j < numBeats; j++) {
      this.mainBeats.push({
        beatIndex: this.currentBeatIndex++,
        beatUnit,
        accent: j === 0 ? 1 : 0,
        bar: barNumber,
        subdivision,
        subdivisionEnabled: Array(Math.max(0, subdivision - 1)).fill(true),
        tempo,
      });
    }

    this.currentBar++;
  }

  private finalizeBeats(): void {
    if (this.countInBeats.length > 0 && this.mainBeats.length === 0) {
      throw new Error('Invalid time signature: Cannot have only count-in bars without regular bars');
    }

    for (let i = 0; i < this.countInBeats.length; i++) {
      this.countInBeats[i].beatIndex = -(this.countInBeats.length - i);
    }

    this.combinedBeats = [...this.countInBeats, ...this.mainBeats];
  }
}

export class TimeSignatureParser {
  private readonly parser: TimeSignatureParserInternal;

  constructor(options: TimeSignatureParserOptions = {}) {
    this.parser = new TimeSignatureParserInternal(options);
  }

  public parse(input: string): ParsedTimeSignature {
    return this.parser.parse(input);
  }
}

export function parseTimeSignature(input: string): Beat[] {
  const parser = new TimeSignatureParser();
  const result = parser.parse(input);
  return result.beats;
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


export function setCookie(c_name:string, value:string, exdays:number) {
  document.cookie = `${c_name}=${value}; expires=${new Date(Date.now() + exdays * 24 * 60 * 60 * 1000).toUTCString()}`;
}

export function getCookie(c_name:string) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) {
        c_end = document.cookie.length;
      }
      return decodeURIComponent(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
