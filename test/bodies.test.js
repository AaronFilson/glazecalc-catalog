// The catalog's clay-body tables and vocabularies (lib/catalog/bodies.ts), passed to the core as host.bodies.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BODIES,
  BODY_CHECKS,
  BODY_CLASSES,
  FIT_RESULTS,
  FIT_TESTS,
  FORMING_METHODS,
  MATERIAL_CLASSES,
  RECIPE_TYPES,
  SHEET_FIELDS,
  SLIP_RANGES,
  WATER_BASES,
  optionLabel,
  optionNamed
} from '../bodies.ts';

describe('the clay-body tables', () => {
  test('are frozen through and give the host its BODIES table', () => {
    for (const table of [
      BODIES,
      BODY_CHECKS,
      BODY_CLASSES,
      FIT_RESULTS,
      FIT_TESTS,
      FORMING_METHODS,
      MATERIAL_CLASSES,
      RECIPE_TYPES,
      SHEET_FIELDS,
      SLIP_RANGES,
      WATER_BASES
    ]) {
      assert.ok(Object.isFrozen(table));
    }
    assert.equal(BODIES.checks, BODY_CHECKS);
    assert.equal(BODIES.slipRanges, SLIP_RANGES);
    assert.equal(BODIES.classDensities['nepheline syenite'], 2.61);
    assert.equal(BODIES.classDensities.plasticizer, 2.5);
    assert.equal(BODIES.classes.porcelain.absorption?.max, 0.5);
    assert.equal(BODY_CHECKS.porcelainSilicaMin, 20);
  });

  test('match options by value, label or alias, and look up labels cleanly', () => {
    assert.equal(optionNamed(RECIPE_TYPES, '  Slip   casting '), 'casting slip');
    assert.equal(optionNamed(BODY_CLASSES, 'Terracotta'), 'terra cotta');
    assert.equal(optionNamed(FORMING_METHODS, 'wheel'), 'throwing');
    assert.equal(optionNamed(FORMING_METHODS, '   '), undefined);
    assert.equal(optionNamed(FORMING_METHODS, '3d-printing'), undefined);
    assert.equal(optionLabel(BODY_CLASSES, 'porcelain'), 'Porcelain');
    assert.equal(optionLabel(BODY_CLASSES, undefined), '');
  });
});
