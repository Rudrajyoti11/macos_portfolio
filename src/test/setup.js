import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    from: vi.fn(() => ({ kill: vi.fn() })),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      kill: vi.fn(),
    })),
  },
}));

// Mock @gsap/react
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback) => {
    const cleanup = callback();
    return cleanup;
  }),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};