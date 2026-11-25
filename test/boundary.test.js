// The catalog: the data and information the core is given. It imports only itself and the core, which sits
// beside it (../core), and the core never imports it. Its files are read as text here, so a slip fails here.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const CATALOG = path.resolve(import.meta.dirname, '..');
const CORE = path.resolve(CATALOG, '..', 'core');
const TESTS = path.join(CATALOG, 'test') + path.sep;
const SKIP = new Set(['node_modules', 'scripts', 'coverage', '.git']);
const filesIn = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    if (SKIP.has(entry)) return [];
    const full = path.join(dir, entry);
    return statSync(full).isDirectory()
      ? filesIn(full)
      : /\.(ts|js)$/.test(full) && !full.endsWith('eslint.config.js')
        ? [full]
        : [];
  });
const code = (file) =>
  readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

describe('the catalog', () => {
  const files = filesIn(CATALOG);

  test('has its files, and the core beside it', () => {
    assert.ok(files.filter((file) => !file.startsWith(TESTS)).length > 10);
    assert.ok(files.filter((file) => file.startsWith(TESTS)).length > 10);
    assert.ok(existsSync(path.join(CORE, 'index.ts')), 'the core is checked out beside the catalog, at ../core');
  });

  test('imports only its own modules and the core', () => {
    let read = 0;
    for (const file of files) {
      const text = code(file);
      const targets = [
        ...text.matchAll(/\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g),
        ...text.matchAll(/\bimport\s*['"]([^'"]+)['"]/g),
        ...text.matchAll(/\b(?:import|require)\(\s*['"]([^'"]+)['"]\s*\)/g)
      ].map((m) => m[1]);
      for (const target of targets) {
        read++;
        // Its own tests may use Node's test runner and assert as well.
        if (file.startsWith(TESTS) && target.startsWith('node:')) continue;
        const resolved = path.resolve(path.dirname(file), target);
        const inside = [CATALOG, CORE].some((dir) => resolved.startsWith(dir + path.sep));
        assert.ok(target.startsWith('.') && inside, `${path.relative(CATALOG, file)} imports ${target}`);
      }
    }
    assert.ok(read > 30);
  });

  test('is imported by no part of the core', () => {
    for (const file of filesIn(CORE)) assert.equal(/\bcatalog\//.test(code(file)), false, path.relative(CORE, file));
  });
});
