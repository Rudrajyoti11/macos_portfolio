import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import WindowControlls from '../../components/WindowControlls.jsx';
import useWindowStore from '../../store/window.js';

vi.mock('../../store/window.js');

describe('WindowControlls', () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useWindowStore.mockReturnValue({ closeWindow: mockClose });
  });

  it('renders three buttons', () => {
    const { container } = render(<WindowControlls target="test" />);
    expect(container.querySelectorAll('#window-controls > div')).toHaveLength(3);
  });

  it('calls closeWindow on close button click', () => {
    const { container } = render(<WindowControlls target="terminal" />);
    fireEvent.click(container.querySelector('.close'));
    expect(mockClose).toHaveBeenCalledWith('terminal');
  });

  it('handles different targets', () => {
    ['terminal', 'finder', 'safari'].forEach(target => {
      mockClose.mockClear();
      const { container } = render(<WindowControlls target={target} />);
      fireEvent.click(container.querySelector('.close'));
      expect(mockClose).toHaveBeenCalledWith(target);
    });
  });
});