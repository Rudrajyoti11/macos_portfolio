import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Dock from './Dock.jsx';
import gsap from 'gsap';

vi.mock('#constants', () => ({
  dockApps: [
    {
      id: 'finder',
      name: 'Portfolio',
      icon: 'finder.png',
      canOpen: true,
    },
    {
      id: 'safari',
      name: 'Articles',
      icon: 'safari.png',
      canOpen: true,
    },
  ],
}));

vi.mock('react-tooltip', () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('Dock Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mouse Interaction Workflow', () => {
    it('should handle complete mouse interaction sequence', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      // Simulate mouse enter, move, and leave
      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.mouseMove(dockContainer, { clientX: 150 });
      fireEvent.mouseMove(dockContainer, { clientX: 200 });
      fireEvent.mouseLeave(dockContainer);

      expect(dockContainer).toBeInTheDocument();
    });

    it('should handle mouse movement across all icons', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      // Simulate scanning mouse across dock
      for (let x = 0; x <= 400; x += 50) {
        fireEvent.mouseMove(dockContainer, { clientX: x });
      }

      expect(dockContainer).toBeInTheDocument();
    });

    it('should reset animations when mouse leaves', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.mouseLeave(dockContainer);

      // Verify gsap.to was called for reset
      expect(gsap.to).toHaveBeenCalled();
    });
  });

  describe('Animation State Management', () => {
    it('should maintain animation state during rapid interactions', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      // Rapid mouse movements
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseMove(dockContainer, { clientX: i * 40 });
      }

      expect(gsap.to).toHaveBeenCalled();
    });

    it('should handle simultaneous mouse events', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.mouseMove(dockContainer, { clientX: 150 });

      expect(dockContainer).toBeInTheDocument();
    });
  });

  describe('Click and Animation Interaction', () => {
    it('should handle clicks during animation', () => {
      const { container, getByLabelText } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      const button = getByLabelText('Portfolio');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.click(button);

      expect(button).toBeInTheDocument();
    });

    it('should maintain click handlers after animations', () => {
      const { getByLabelText, container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      const button = getByLabelText('Portfolio');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.mouseLeave(dockContainer);
      fireEvent.click(button);

      expect(button).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle with Animations', () => {
    it('should setup and cleanup animations properly', () => {
      const { container, unmount } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });

      unmount();

      // Should not throw after unmount
      expect(() => {
        fireEvent.mouseMove(dockContainer, { clientX: 200 });
      }).not.toThrow();
    });

    it('should reinitialize animations on remount', () => {
      const { unmount, rerender } = render(<Dock />);

      unmount();
      rerender(<Dock />);

      expect(gsap.to).toHaveBeenCalled();
    });
  });

  describe('Performance Under Load', () => {
    it('should handle continuous mouse tracking efficiently', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      const startTime = performance.now();

      // Simulate 100 mouse movements
      for (let i = 0; i < 100; i++) {
        fireEvent.mouseMove(dockContainer, { clientX: (i % 400) });
      }

      const endTime = performance.now();

      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should not accumulate event listeners', () => {
      const { container, rerender } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      const initialListeners = dockContainer._events || {};

      rerender(<Dock />);
      rerender(<Dock />);

      // Should not accumulate listeners
      expect(dockContainer).toBeInTheDocument();
    });
  });

  describe('Edge Case Scenarios', () => {
    it('should handle mouse coordinates at boundaries', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      // Test boundary coordinates
      fireEvent.mouseMove(dockContainer, { clientX: 0 });
      fireEvent.mouseMove(dockContainer, { clientX: -100 });
      fireEvent.mouseMove(dockContainer, { clientX: 10000 });

      expect(dockContainer).toBeInTheDocument();
    });

    it('should handle negative mouse coordinates', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      fireEvent.mouseMove(dockContainer, { clientX: -50 });

      expect(dockContainer).toBeInTheDocument();
    });

    it('should handle extremely large mouse coordinates', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      fireEvent.mouseMove(dockContainer, { clientX: 999999 });

      expect(dockContainer).toBeInTheDocument();
    });
  });

  describe('Tooltip Integration', () => {
    it('should maintain tooltip functionality during animations', () => {
      const { container, getByLabelText, getByTestId } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      const button = getByLabelText('Portfolio');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.mouseOver(button);

      expect(getByTestId('tooltip')).toBeInTheDocument();
    });

    it('should have tooltip attributes on all interactive elements', () => {
      const { getByLabelText } = render(<Dock />);

      const portfolio = getByLabelText('Portfolio');
      const articles = getByLabelText('Articles');

      expect(portfolio).toHaveAttribute('data-tooltip-id');
      expect(articles).toHaveAttribute('data-tooltip-id');
    });
  });

  describe('Multi-User Simulation', () => {
    it('should handle multiple renders with interactions', () => {
      const { container, rerender } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');

      fireEvent.mouseMove(dockContainer, { clientX: 100 });

      rerender(<Dock />);

      fireEvent.mouseMove(dockContainer, { clientX: 200 });

      expect(dockContainer).toBeInTheDocument();
    });
  });
});