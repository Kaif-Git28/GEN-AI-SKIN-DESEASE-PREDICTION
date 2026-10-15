import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAbcdePoints, evaluateAbcdeRisk, getRiskBadgeColor } from './abcde.ts';

test('calculateAbcdePoints correctly assigns low score for benign characteristics', () => {
  const result = calculateAbcdePoints({
    asymmetryScore: 'Symmetric',
    borderScore: 'Regular',
    colorScore: 'Uniform Single Shade',
    isOver6mm: false,
    evolutionLevel: 'Reported Stable',
  });

  assert.equal(result.asymmetryPoints, 0);
  assert.equal(result.borderPoints, 0);
  assert.equal(result.colorPoints, 0);
  assert.equal(result.diameterPoints, 0);
  assert.equal(result.evolutionPoints, 0);
  assert.equal(result.totalPoints, 0);

  const risk = evaluateAbcdeRisk(result.totalPoints);
  assert.equal(risk.riskLevel, 'low');
});

test('calculateAbcdePoints correctly scores high-risk melanoma features', () => {
  const result = calculateAbcdePoints({
    asymmetryScore: 'Marked Asymmetry',
    borderScore: 'Markedly Irregular / Notched',
    colorScore: 'Marked Variegation (4+ Colors)',
    isOver6mm: true,
    evolutionLevel: 'Rapid Recent Changes',
  });

  assert.equal(result.asymmetryPoints, 2);
  assert.equal(result.borderPoints, 2);
  assert.equal(result.colorPoints, 2);
  assert.equal(result.diameterPoints, 1);
  assert.equal(result.evolutionPoints, 2);
  assert.equal(result.totalPoints, 9);

  const risk = evaluateAbcdeRisk(result.totalPoints);
  assert.equal(risk.riskLevel, 'urgent');
});

test('evaluateAbcdeRisk scales correctly with threshold points', () => {
  assert.equal(evaluateAbcdeRisk(0).riskLevel, 'low');
  assert.equal(evaluateAbcdeRisk(2).riskLevel, 'moderate');
  assert.equal(evaluateAbcdeRisk(4).riskLevel, 'high');
  assert.equal(evaluateAbcdeRisk(6).riskLevel, 'urgent');
  assert.equal(evaluateAbcdeRisk(8).riskLevel, 'urgent');
});

test('getRiskBadgeColor returns appropriate styling for each risk level', () => {
  const urgentBadge = getRiskBadgeColor('urgent');
  assert.ok(urgentBadge.text.includes('rose'));
  assert.equal(urgentBadge.label, 'Urgent Clinical Evaluation');

  const lowBadge = getRiskBadgeColor('low');
  assert.ok(lowBadge.text.includes('emerald'));
  assert.equal(lowBadge.label, 'Low Risk / Benign Profile');
});
