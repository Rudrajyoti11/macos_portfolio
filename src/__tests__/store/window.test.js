import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useWindowStore from '../../store/window.js';

vi.mock('#constants/index.js', () => ({
  INITIAL_Z_INDEX: 100,
  WINDOW_CONFIG: {
    terminal: { isOpen: false, zIndex: 100, data: null },
    finder: { isOpen: false, zIndex: 100, data: null },
  },
}));

describe('useWindowStore', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useWindowStore());
    expect(result.current.windows).toBeDefined();
    expect(result.current.nextZIndex).toBe(101);
  });

  it('should open window', () => {
    const { result } = renderHook(() => useWindowStore());
    act(() => result.current.openWindow('terminal'));
    expect(result.current.windows.terminal.isOpen).toBe(true);
  });

  it('should close window', () => {
    const { result } = renderHook(() => useWindowStore());
    act(() => {
      result.current.openWindow('terminal');
      result.current.closeWindow('terminal');
    });
    expect(result.current.windows.terminal.isOpen).toBe(false);
  });

  it('should focus window and update zIndex', () => {
    const { result } = renderHook(() => useWindowStore());
    act(() => result.current.openWindow('terminal'));
    const oldZ = result.current.windows.terminal.zIndex;
    act(() => result.current.focusWindow('terminal'));
    expect(result.current.windows.terminal.zIndex).toBeGreaterThan(oldZ);
  });

  it('should handle invalid window key gracefully', () => {
    const { result } = renderHook(() => useWindowStore());
    expect(() => act(() => result.current.openWindow('invalid'))).not.toThrow();
  });
});