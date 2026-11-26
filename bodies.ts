// Clay-body classes, forming methods, slip SG ranges, material classes, fit-test kinds, data-sheet
// field metadata, and the BODIES table a host passes to the core as `host.bodies`
// (docs/sources/clay-bodies.md).

import type { MaterialClass } from '../core/traits.ts';
import type { DataSheet } from '../core/types.ts';
import type {
  BodyCheckThresholds,
  BodyClass,
  BodyClassSpec,
  BodyTable,
  FitResult,
  FitTestKind,
  FormingMethod,
  SlipRange
} from '../core/body/types.ts';
import { deepFreeze } from './names.ts';

export type RecipeKind = 'glaze' | 'clay body' | 'slip' | 'engobe' | 'casting slip' | 'terra sigillata';
export type WaterBasis = 'dry' | 'wet';

export interface NamedOption<Value extends string = string> {
  readonly value: Value;
  readonly label: string;
  readonly also: ReadonlyArray<string>;
}

export interface RecipeTypeOption extends NamedOption<RecipeKind> {
  readonly body: boolean;
  readonly slip: boolean;
  readonly formed: boolean;
}

export interface BodyClassOption extends NamedOption<BodyClass>, BodyClassSpec {}

export interface MaterialClassOption {
  readonly value: MaterialClass;
  readonly label: string;
  readonly density: number;
}

export interface SheetFieldMeta {
  readonly field: keyof DataSheet;
  readonly label: string;
  readonly unit?: string;
  readonly placeholder?: string;
}

const RECIPE_TYPES: ReadonlyArray<RecipeTypeOption> = deepFreeze<RecipeTypeOption[]>([
  { value: 'glaze', label: 'Glaze', also: [], body: false, slip: false, formed: false },
  {
    value: 'clay body',
    label: 'Clay body',
    also: ['body', 'clay', 'porcelain', 'stoneware', 'earthenware'],
    body: true,
    slip: false,
    formed: true
  },
  { value: 'slip', label: 'Slip', also: [], body: true, slip: true, formed: false },
  { value: 'engobe', label: 'Engobe', also: [], body: true, slip: true, formed: false },
  {
    value: 'casting slip',
    label: 'Casting slip',
    also: ['slipcasting', 'slip casting'],
    body: true,
    slip: true,
    formed: true
  },
  { value: 'terra sigillata', label: 'Terra sigillata', also: ['terra sig'], body: true, slip: true, formed: false }
]);

const BODY_CLASSES: ReadonlyArray<BodyClassOption> = deepFreeze<BodyClassOption[]>([
  {
    value: 'terra cotta',
    label: 'Terra cotta or red earthenware',
    also: ['terracotta', 'red earthenware', 'earthenware'],
    coneRange: ['08', '02'],
    absorption: { min: 5, max: 15 },
    shrinkage: { min: 7, max: 11 }
  },
  {
    value: 'white earthenware',
    label: 'White earthenware',
    also: ['whiteware', 'talc body'],
    coneRange: ['06', '2'],
    absorption: { min: 6, max: 12 },
    shrinkage: { min: 6, max: 10 }
  },
  {
    value: 'stoneware',
    label: 'Stoneware',
    also: [],
    coneRange: ['5', '10'],
    absorption: { min: 0.5, max: 3 },
    shrinkage: { min: 10, max: 14 }
  },
  {
    value: 'porcelain',
    label: 'Porcelain',
    also: [],
    coneRange: ['6', '13'],
    absorption: { min: 0, max: 0.5 },
    shrinkage: { min: 11, max: 16 }
  },
  {
    value: 'flameware',
    label: 'Flameware',
    also: ['ovenware'],
    coneRange: ['6', '11'],
    absorption: { min: 1, max: 6 },
    shrinkage: { min: 7, max: 11 }
  },
  {
    value: 'sculpture or raku',
    label: 'Sculpture or raku',
    also: ['sculpture', 'raku'],
    coneRange: ['08', '10'],
    absorption: { min: 4, max: 15 },
    shrinkage: { min: 5, max: 10 }
  },
  {
    value: 'paper clay',
    label: 'Paper clay',
    also: ['paperclay'],
    coneRange: ['06', '10'],
    absorption: { min: 1, max: 15 },
    shrinkage: { min: 6, max: 14 }
  }
]);

const FORMING_METHODS: ReadonlyArray<NamedOption<FormingMethod>> = deepFreeze<Array<NamedOption<FormingMethod>>>([
  { value: 'throwing', label: 'Throwing', also: ['thrown', 'wheel'] },
  { value: 'handbuilding', label: 'Handbuilding', also: ['hand building', 'handbuilt'] },
  { value: 'casting', label: 'Slip casting', also: ['casting', 'cast'] },
  { value: 'pressing', label: 'Pressing', also: ['press molding', 'press moulding'] },
  { value: 'jiggering', label: 'Jiggering or jollying', also: ['jigger', 'jolly'] },
  { value: 'extruding', label: 'Extruding', also: ['extrusion'] },
  { value: 'sculpture', label: 'Sculpture', also: ['sculpting'] }
]);

const WATER_BASES: ReadonlyArray<{ readonly value: WaterBasis; readonly label: string }> = deepFreeze([
  { value: 'dry', label: 'g per 100 g dry' },
  { value: 'wet', label: '% of the wet clay' }
]);

const MATERIAL_CLASSES: ReadonlyArray<MaterialClassOption> = deepFreeze<MaterialClassOption[]>([
  { value: 'ball clay', label: 'Ball clay', density: 2.6 },
  { value: 'kaolin', label: 'Kaolin', density: 2.6 },
  { value: 'fire clay', label: 'Fire clay', density: 2.6 },
  { value: 'stoneware clay', label: 'Stoneware clay', density: 2.6 },
  { value: 'earthenware clay', label: 'Earthenware or red clay', density: 2.6 },
  { value: 'plasticizer', label: 'Bentonite or other plasticizer', density: 2.5 },
  { value: 'feldspar', label: 'Feldspar', density: 2.6 },
  { value: 'nepheline syenite', label: 'Nepheline syenite', density: 2.61 },
  { value: 'silica', label: 'Silica', density: 2.65 },
  { value: 'talc', label: 'Talc', density: 2.75 },
  { value: 'wollastonite', label: 'Wollastonite', density: 2.9 },
  { value: 'grog', label: 'Grog or molochite', density: 2.6 },
  { value: 'refractory', label: 'Kyanite, pyrophyllite or refractory', density: 3.2 },
  { value: 'deflocculant', label: 'Deflocculant', density: 2.6 },
  { value: 'flocculant', label: 'Flocculant', density: 2.6 },
  { value: 'other', label: 'Other', density: 2.6 }
]);

const SLIP_RANGES: Readonly<Record<string, SlipRange>> = deepFreeze({
  slip: { sg: { min: 1.35, max: 1.55 } },
  engobe: { sg: { min: 1.4, max: 1.6 } },
  'casting slip': { sg: { min: 1.72, max: 1.84 } },
  'terra sigillata': { sg: { min: 1.12, max: 1.2 } }
});

const BODY_CHECKS: BodyCheckThresholds = deepFreeze<BodyCheckThresholds>({
  porcelainSilicaMin: 20,
  maxDryingShrinkage: 7.5,
  castingPlasticRange: [40, 60],
  castingPlasticizerMax: 0.5
});

const FIT_TESTS: ReadonlyArray<{ readonly value: FitTestKind; readonly label: string; readonly short?: string }> =
  deepFreeze([
    { value: 'iwct', label: '300 °F to ice water (IWCT)', short: 'IWCT' },
    { value: 'bwiw', label: 'Boiling to ice water (BWIW)', short: 'BWIW' },
    { value: 'pressure', label: 'Pressure cooker or autoclave' },
    { value: 'gbbt', label: 'Glaze-body bend test (GBBT)', short: 'GBBT' },
    { value: 'other', label: 'Another test' }
  ]);

const FIT_RESULTS: ReadonlyArray<{ readonly value: FitResult; readonly label: string }> = deepFreeze([
  { value: 'passed', label: 'Passed' },
  { value: 'crazed', label: 'Crazed' },
  { value: 'shivered', label: 'Shivered' }
]);

const SHEET_FIELDS: ReadonlyArray<SheetFieldMeta> = deepFreeze<SheetFieldMeta[]>([
  { field: 'cone', label: 'Fired at cone', placeholder: '10' },
  { field: 'dryingShrinkage', label: 'Drying shrinkage', unit: '%' },
  { field: 'firingShrinkage', label: 'Firing shrinkage', unit: '%' },
  { field: 'totalShrinkage', label: 'Total shrinkage', unit: '%' },
  { field: 'absorption', label: 'Absorption', unit: '%' },
  { field: 'waterOfPlasticity', label: 'Water of plasticity', unit: '%' },
  { field: 'finer1um', label: 'Finer than 1 µm', unit: '%' },
  { field: 'finer2um', label: 'Finer than 2 µm', unit: '%' },
  { field: 'mesh', label: 'Particle size', placeholder: '0.5% on 325 mesh' },
  { field: 'dryStrength', label: 'Dry strength', placeholder: '550 psi' },
  { field: 'density', label: 'Density of the solids', unit: 'g/cm³', placeholder: '2.6' }
]);

const BODIES: BodyTable = deepFreeze<BodyTable>({
  classes: Object.fromEntries(
    BODY_CLASSES.map(({ value, coneRange, absorption, shrinkage }) => [value, { coneRange, absorption, shrinkage }])
  ) as Record<BodyClass, BodyClassSpec>,
  slipRanges: SLIP_RANGES,
  classDensities: Object.fromEntries(MATERIAL_CLASSES.map((c) => [c.value, c.density])) as Record<
    MaterialClass,
    number
  >,
  checks: BODY_CHECKS
});

/** Matches a named option by value, label or alias, ignoring case and extra whitespace. */
function optionNamed<Value extends string>(
  options: ReadonlyArray<NamedOption<Value>>,
  text: string
): Value | undefined {
  const wanted = text.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!wanted) return undefined;
  return options.find((o) => [o.value, o.label.toLowerCase(), ...o.also].includes(wanted))?.value;
}

/** Display label of an option, or '' when absent. */
function optionLabel<Value extends string>(
  options: ReadonlyArray<{ readonly value: Value; readonly label: string }>,
  value?: Value
): string {
  return options.find((o) => o.value === value)?.label ?? '';
}

export {
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
};
