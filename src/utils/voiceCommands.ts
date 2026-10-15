import type { VoiceIntent } from '../types/dermatology.ts';

export function parseVoiceCommand(transcript: string): VoiceIntent {
  const clean = transcript.toLowerCase().trim();

  // Stop / pause speech
  if (
    clean.includes('stop speak') ||
    clean.includes('stop reading') ||
    clean.includes('stop voice') ||
    clean.includes('stop audio') ||
    clean.includes('pause audio') ||
    clean.includes('shut up') ||
    clean.includes('be quiet') ||
    clean === 'stop' ||
    clean === 'silence' ||
    clean === 'mute'
  ) {
    return { type: 'STOP_SPEAKING' };
  }

  // Read report / Speak results
  if (
    clean.includes('read report') ||
    clean.includes('read diagnosis') ||
    clean.includes('read result') ||
    clean.includes('read findings') ||
    clean.includes('speak report') ||
    clean.includes('speak diagnosis') ||
    clean.includes('speak result') ||
    clean.includes('read aloud') ||
    clean.includes('tell me the diagnosis') ||
    clean.includes('what are the results') ||
    clean.includes('what is the result') ||
    clean.includes('what did you find') ||
    clean === 'read' ||
    clean === 'speak'
  ) {
    return { type: 'READ_REPORT' };
  }

  // Analyze / Predict
  if (
    clean.includes('analyze') ||
    clean.includes('predict') ||
    clean.includes('scan') ||
    clean.includes('diagnos') ||
    clean.includes('run ml') ||
    clean.includes('classify') ||
    clean.includes('check lesion') ||
    clean.includes('examine')
  ) {
    return { type: 'ANALYZE_IMAGE' };
  }

  // Sample load commands
  if (clean.includes('sample') || clean.includes('example')) {
    if (clean.includes('1') || clean.includes('one') || clean.includes('melanoma')) {
      return { type: 'LOAD_SAMPLE', sampleId: 'case-melanoma' };
    }
    if (clean.includes('2') || clean.includes('two') || clean.includes('basal') || clean.includes('carcinoma') || clean.includes('bcc')) {
      return { type: 'LOAD_SAMPLE', sampleId: 'case-bcc' };
    }
    if (clean.includes('3') || clean.includes('three') || clean.includes('psoriasis')) {
      return { type: 'LOAD_SAMPLE', sampleId: 'case-psoriasis' };
    }
    if (clean.includes('4') || clean.includes('four') || clean.includes('eczema') || clean.includes('dermatitis')) {
      return { type: 'LOAD_SAMPLE', sampleId: 'case-eczema' };
    }
    if (clean.includes('5') || clean.includes('five') || clean.includes('seborrheic') || clean.includes('keratosis')) {
      return { type: 'LOAD_SAMPLE', sampleId: 'case-seborrheic' };
    }
    if (clean.includes('6') || clean.includes('six') || clean.includes('fungal') || clean.includes('tinea') || clean.includes('ringworm')) {
      return { type: 'LOAD_SAMPLE', sampleId: 'case-tinea' };
    }
    // Default sample
    return { type: 'LOAD_SAMPLE', sampleId: 'case-melanoma' };
  }

  // Clear / Reset
  if (
    clean.includes('clear') ||
    clean.includes('reset') ||
    clean.includes('remove image') ||
    clean.includes('delete image') ||
    clean.includes('start over')
  ) {
    return { type: 'CLEAR_IMAGE' };
  }

  // Camera capture
  if (
    clean.includes('camera') ||
    clean.includes('take photo') ||
    clean.includes('capture photo') ||
    clean.includes('snap photo') ||
    clean.includes('webcam')
  ) {
    return { type: 'OPEN_CAMERA' };
  }

  // Grid / dermatoscope toggle
  if (
    clean.includes('grid') ||
    clean.includes('dermatoscope') ||
    clean.includes('ruler') ||
    clean.includes('scale')
  ) {
    return { type: 'TOGGLE_DERMATOSCOPE_GRID' };
  }

  // Export / Print
  if (
    clean.includes('print') ||
    clean.includes('export') ||
    clean.includes('download report') ||
    clean.includes('save report') ||
    clean.includes('pdf')
  ) {
    return { type: 'EXPORT_REPORT' };
  }

  // Tab navigation
  if (clean.includes('history') || clean.includes('archive') || clean.includes('past scan')) {
    return { type: 'SWITCH_TAB', tab: 'history' };
  }
  if (clean.includes('guide') || clean.includes('help') || clean.includes('command') || clean.includes('what can i say')) {
    return { type: 'SHOW_HELP' };
  }
  if (clean.includes('sample library') || clean.includes('show samples') || clean.includes('all samples')) {
    return { type: 'SWITCH_TAB', tab: 'samples' };
  }
  if (clean.includes('diagnostic tab') || clean.includes('home') || clean.includes('main view') || clean.includes('scanner')) {
    return { type: 'SWITCH_TAB', tab: 'diagnostic' };
  }

  // Natural language query / question
  if (
    clean.startsWith('what ') ||
    clean.startsWith('why ') ||
    clean.startsWith('is ') ||
    clean.startsWith('can ') ||
    clean.startsWith('should ') ||
    clean.startsWith('how ') ||
    clean.includes('cancer') ||
    clean.includes('melanoma') ||
    clean.includes('doctor')
  ) {
    return { type: 'ASK_QUESTION', question: transcript };
  }

  return { type: 'UNKNOWN', query: transcript };
}
