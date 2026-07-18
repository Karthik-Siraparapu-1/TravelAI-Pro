import { test } from 'node:test';
import assert from 'node:assert';
import { cn } from './utils';

test('cn utility function merges tailwind classes correctly', () => {
  const result = cn('px-2', 'py-1', 'px-4');
  assert.ok(result.includes('px-4'));
  assert.ok(result.includes('py-1'));
  // tailwind-merge resolves conflicts
  assert.ok(!result.includes('px-2'));
});

test('cn utility handles conditional class evaluation', () => {
  const isPrimary = true;
  const isSecondary = false;
  const result = cn(
    'base-class',
    isPrimary && 'primary-class',
    isSecondary && 'secondary-class'
  );
  assert.ok(result.includes('base-class'));
  assert.ok(result.includes('primary-class'));
  assert.ok(!result.includes('secondary-class'));
});
