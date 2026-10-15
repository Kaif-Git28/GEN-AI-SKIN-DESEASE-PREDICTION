import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVoiceCommand } from './voiceCommands.ts';

test('parseVoiceCommand identifies analyze intent from various vocal phrases', () => {
  assert.deepEqual(parseVoiceCommand('analyze image'), { type: 'ANALYZE_IMAGE' });
  assert.deepEqual(parseVoiceCommand('Please scan this lesion'), { type: 'ANALYZE_IMAGE' });
  assert.deepEqual(parseVoiceCommand('run ML classification'), { type: 'ANALYZE_IMAGE' });
  assert.deepEqual(parseVoiceCommand('predict disease'), { type: 'ANALYZE_IMAGE' });
});

test('parseVoiceCommand identifies read report and stop speaking', () => {
  assert.deepEqual(parseVoiceCommand('read report'), { type: 'READ_REPORT' });
  assert.deepEqual(parseVoiceCommand('read diagnosis out loud'), { type: 'READ_REPORT' });
  assert.deepEqual(parseVoiceCommand('speak result'), { type: 'READ_REPORT' });

  assert.deepEqual(parseVoiceCommand('stop speaking'), { type: 'STOP_SPEAKING' });
  assert.deepEqual(parseVoiceCommand('silence'), { type: 'STOP_SPEAKING' });
  assert.deepEqual(parseVoiceCommand('stop audio now'), { type: 'STOP_SPEAKING' });
});

test('parseVoiceCommand detects sample loading requests', () => {
  const sample1 = parseVoiceCommand('load sample 1');
  assert.equal(sample1.type, 'LOAD_SAMPLE');
  if (sample1.type === 'LOAD_SAMPLE') {
    assert.equal(sample1.sampleId, 'case-melanoma');
  }

  const sampleEczema = parseVoiceCommand('show eczema sample');
  assert.equal(sampleEczema.type, 'LOAD_SAMPLE');
  if (sampleEczema.type === 'LOAD_SAMPLE') {
    assert.equal(sampleEczema.sampleId, 'case-eczema');
  }
});

test('parseVoiceCommand detects camera, grid, export, and help', () => {
  assert.deepEqual(parseVoiceCommand('take photo with camera'), { type: 'OPEN_CAMERA' });
  assert.deepEqual(parseVoiceCommand('toggle dermatoscope grid'), { type: 'TOGGLE_DERMATOSCOPE_GRID' });
  assert.deepEqual(parseVoiceCommand('print report'), { type: 'EXPORT_REPORT' });
  assert.deepEqual(parseVoiceCommand('show voice commands help'), { type: 'SHOW_HELP' });
  assert.deepEqual(parseVoiceCommand('clear image'), { type: 'CLEAR_IMAGE' });
});

test('parseVoiceCommand routes questions to ASK_QUESTION', () => {
  const res = parseVoiceCommand('what does ABCDE stand for in melanoma?');
  assert.equal(res.type, 'ASK_QUESTION');
});
