import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
afterEach(() => cleanup());

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn().mockReturnThis(), from: vi.fn().mockReturnThis(), play: vi.fn().mockReturnThis() })),
  },
}));

vi.mock('gsap/Draggable', () => ({
  Draggable: { create: vi.fn(() => [{ kill: vi.fn() }]) },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback) => { if (typeof callback === 'function') callback(); }),
}));