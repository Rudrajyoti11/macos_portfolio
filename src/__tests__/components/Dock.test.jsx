import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dock from '../../components/Dock.jsx';
import useWindowStore from '../../store/window.js';

vi.mock('../../store/window.js');
vi.mock('#constants/index.js', () => ({
  dockApps: [
    { id: 'terminal', icon: 'terminal.png', name: 'Terminal', canOpen: true },
    { id: 'finder', icon: 'finder.png', name: 'Finder', canOpen: true },
    { id: 'trash', icon: 'trash.png', name: 'Trash', canOpen: false },
  ],
}));
vi.mock('react-tooltip', () => ({ Tooltip: () => <div data-testid="tooltip" /> }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn((cb) => cb && cb()) }));
vi.mock('gsap', () => ({ default: { to: vi.fn() } }));

describe('Dock', () => {
  const mockOpen = vi.fn();
  const mockClose = vi.fn();
  let mockWindows;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWindows = {
      terminal: { isOpen: false, zIndex: 100 },
      finder: { isOpen: false, zIndex: 100 },
      trash: { isOpen: false, zIndex: 100 },
    };
    useWindowStore.mockReturnValue({
      openWindow: mockOpen,
      closeWindow: mockClose,
      windows: mockWindows,
    });
  });

  it('renders all apps', () => {
    render(<Dock />);
    expect(screen.getByAltText('Terminal')).toBeInTheDocument();
    expect(screen.getByAltText('Finder')).toBeInTheDocument();
    expect(screen.getByAltText('Trash')).toBeInTheDocument();
  });

  it('opens window when clicked and closed', () => {
    render(<Dock />);
    fireEvent.click(screen.getByAltText('Terminal'));
    expect(mockOpen).toHaveBeenCalledWith('terminal');
  });

  it('closes window when clicked and open', () => {
    mockWindows.terminal.isOpen = true;
    render(<Dock />);
    fireEvent.click(screen.getByAltText('Terminal'));
    expect(mockClose).toHaveBeenCalledWith('terminal');
  });

  it('does not open when canOpen is false', () => {
    render(<Dock />);
    fireEvent.click(screen.getByAltText('Trash'));
    expect(mockOpen).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();
  });
});