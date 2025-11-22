import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WindowWrapper from '../../hoc/WindowWrapper.jsx';
import useWindowStore from '../../store/window.js';

vi.mock('../../store/window.js');
vi.mock('gsap', () => ({ default: { fromTo: vi.fn() } }));
vi.mock('gsap/Draggable', () => ({ Draggable: { create: vi.fn(() => [{ kill: vi.fn() }]) } }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn((cb) => cb && cb()) }));

describe('WindowWrapper', () => {
  const TestComp = ({ value }) => <div data-testid="test">{value}</div>;

  beforeEach(() => {
    useWindowStore.mockReturnValue({
      focusWindow: vi.fn(),
      windows: { test: { isOpen: true, zIndex: 100 } },
    });
  });

  it('wraps component correctly', () => {
    const Wrapped = WindowWrapper(TestComp, 'test');
    render(<Wrapped value="hello" />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('applies correct zIndex', () => {
    useWindowStore.mockReturnValue({
      focusWindow: vi.fn(),
      windows: { test: { isOpen: true, zIndex: 250 } },
    });
    const Wrapped = WindowWrapper(TestComp, 'test');
    const { container } = render(<Wrapped />);
    expect(container.querySelector('section')).toHaveStyle({ zIndex: '250' });
  });

  it('hides when not open', () => {
    useWindowStore.mockReturnValue({
      focusWindow: vi.fn(),
      windows: { test: { isOpen: false, zIndex: 100 } },
    });
    const Wrapped = WindowWrapper(TestComp, 'test');
    const { container } = render(<Wrapped />);
    expect(container.querySelector('section')).toHaveStyle({ display: 'none' });
  });
});