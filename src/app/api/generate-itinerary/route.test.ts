import { test } from 'node:test';
import assert from 'node:assert';
import { getMockItinerary } from './route';

test('getMockItinerary creates a valid itinerary structure', () => {
  const result = getMockItinerary({
    origin: 'New York',
    destination: 'Hyderabad',
    startDate: '2026-08-01',
    endDate: '2026-08-05',
    adults: 2,
    children: 1,
    budget: 'moderate',
    travelStyle: 'cultural',
    currency: 'INR'
  });

  assert.strictEqual(result.destination, 'Hyderabad');
  assert.ok(result.itinerary.length > 0);
  assert.strictEqual(result.budget.currency, 'INR');
  assert.ok(result.weatherForecast.includes('Hyderabad') || result.weatherForecast.includes('dry') || result.weatherForecast.includes('Warm'));
});

test('getMockItinerary fallback works for unspecified destination', () => {
  const result = getMockItinerary({
    origin: 'New York',
    destination: '',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    adults: 1,
    children: 0,
    budget: 'backpacker',
    travelStyle: 'solo',
    interests: ['Nightlife'],
    currency: 'USD'
  });

  // Since interest has Nightlife, destination should resolve to Tokyo
  assert.strictEqual(result.destination, 'Tokyo, Japan');
  assert.strictEqual(result.budget.currency, 'USD');
});
