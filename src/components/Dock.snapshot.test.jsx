import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Dock from './Dock.jsx';

vi.mock('#constants', () => ({
  dockApps: [
    {
      id: 'finder',
      name: 'Portfolio',
      icon: 'finder.png',
      canOpen: true,
    },
    {
      id: 'trash',
      name: 'Archive',
      icon: 'trash.png',
      canOpen: false,
    },
  ],
}));

vi.mock('react-tooltip', () => ({
  Tooltip: ({ id }) => <div data-testid={`tooltip-${id}`} />,
}));

describe('Dock Snapshot Tests', () => {
  describe('DOM Structure Snapshots', () => {
    it('should match initial render snapshot', () => {
      const { container } = render(<Dock />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match structure with enabled apps', () => {
      const { container } = render(<Dock />);
      const buttons = container.querySelectorAll('button:not([disabled])');
      expect(buttons).toMatchSnapshot();
    });

    it('should match structure with disabled apps', () => {
      const { container } = render(<Dock />);
      const disabledButtons = container.querySelectorAll('button[disabled]');
      expect(disabledButtons).toMatchSnapshot();
    });

    it('should match dock container structure', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      expect(dockContainer).toMatchSnapshot();
    });
  });

  describe('Component HTML Output', () => {
    it('should generate consistent HTML structure', () => {
      const { container } = render(<Dock />);
      const html = container.innerHTML;
      
      expect(html).toContain('dock-container');
      expect(html).toContain('dock-icon');
      expect(html).toContain('data-tooltip-id');
    });

    it('should maintain consistent class names', () => {
      const { container } = render(<Dock />);
      
      expect(container.querySelector('.dock-container')).toBeTruthy();
      expect(container.querySelectorAll('.dock-icon')).toHaveLength(2);
      expect(container.querySelectorAll('.relative')).toHaveLength(2);
    });
  });

  describe('Attributes Consistency', () => {
    it('should maintain consistent tooltip attributes', () => {
      const { container } = render(<Dock />);
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach(button => {
        expect(button.getAttribute('data-tooltip-id')).toBe('dock-tooltip');
        expect(button.getAttribute('data-tooltip-delay-show')).toBe('150');
      });
    });

    it('should maintain consistent image attributes', () => {
      const { container } = render(<Dock />);
      const images = container.querySelectorAll('img');
      
      images.forEach(image => {
        expect(image.getAttribute('loading')).toBe('lazy');
        expect(image.hasAttribute('alt')).toBe(true);
        expect(image.hasAttribute('src')).toBe(true);
      });
    });
  });

  describe('Regression Prevention', () => {
    it('should not add unexpected elements', () => {
      const { container } = render(<Dock />);
      
      // Should have exactly one section
      expect(container.querySelectorAll('section')).toHaveLength(1);
      
      // Should have exactly one dock-container
      expect(container.querySelectorAll('.dock-container')).toHaveLength(1);
      
      // Should have correct number of buttons (2 in mock)
      expect(container.querySelectorAll('button')).toHaveLength(2);
    });

    it('should not change tooltip placement', () => {
      const { getByTestId } = render(<Dock />);
      const tooltip = getByTestId('tooltip-dock-tooltip');
      
      expect(tooltip).toBeDefined();
    });

    it('should preserve icon container structure', () => {
      const { container } = render(<Dock />);
      const iconContainers = container.querySelectorAll('.relative.flex.justify-center');
      
      expect(iconContainers).toHaveLength(2);
    });
  });

  describe('Visual Regression Markers', () => {
    it('should maintain opacity classes', () => {
      const { container } = render(<Dock />);
      const images = container.querySelectorAll('img');
      
      // First image (enabled app) should not have opacity-60
      expect(images[0].classList.contains('opacity-60')).toBe(false);
      
      // Second image (disabled app) should have opacity-60
      expect(images[1].classList.contains('opacity-60')).toBe(true);
    });

    it('should maintain CSS class consistency', () => {
      const { container } = render(<Dock />);
      
      const section = container.querySelector('section');
      expect(section.id).toBe('dock');
      
      const dockContainer = container.querySelector('.dock-container');
      expect(dockContainer.classList.contains('dock-container')).toBe(true);
    });
  });
});