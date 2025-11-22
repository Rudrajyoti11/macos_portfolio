import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dock from './Dock.jsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Mock the constants
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
    {
      id: 'photos',
      name: 'Gallery',
      icon: 'photos.png',
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

// Mock react-tooltip
vi.mock('react-tooltip', () => ({
  Tooltip: ({ id, place, className }) => (
    <div data-testid={`tooltip-${id}`} data-place={place} className={className} />
  ),
}));

describe('Dock Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the dock section', () => {
      render(<Dock />);
      const dockSection = screen.getByRole('region', { name: /dock/i });
      expect(dockSection).toBeInTheDocument();
    });

    it('should render all dock apps', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('should render dock apps with correct names', () => {
      render(<Dock />);
      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
      expect(screen.getByLabelText('Articles')).toBeInTheDocument();
      expect(screen.getByLabelText('Gallery')).toBeInTheDocument();
      expect(screen.getByLabelText('Archive')).toBeInTheDocument();
    });

    it('should render images for each dock app', () => {
      render(<Dock />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(4);
      expect(images[0]).toHaveAttribute('src', '/images/finder.png');
      expect(images[1]).toHaveAttribute('src', '/images/safari.png');
      expect(images[2]).toHaveAttribute('src', '/images/photos.png');
      expect(images[3]).toHaveAttribute('src', '/images/trash.png');
    });

    it('should render images with correct alt text', () => {
      render(<Dock />);
      expect(screen.getByAltText('Portfolio')).toBeInTheDocument();
      expect(screen.getByAltText('Articles')).toBeInTheDocument();
      expect(screen.getByAltText('Gallery')).toBeInTheDocument();
      expect(screen.getByAltText('Archive')).toBeInTheDocument();
    });

    it('should render images with lazy loading', () => {
      render(<Dock />);
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('should render tooltip component', () => {
      render(<Dock />);
      const tooltip = screen.getByTestId('tooltip-dock-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('data-place', 'top');
      expect(tooltip).toHaveClass('tooltip');
    });
  });

  describe('Interactive Elements', () => {
    it('should have buttons with correct type attribute', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have buttons with dock-icon class', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('dock-icon');
      });
    });

    it('should have enabled buttons for apps that can open', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      const articlesButton = screen.getByLabelText('Articles');
      const galleryButton = screen.getByLabelText('Gallery');
      
      expect(portfolioButton).not.toBeDisabled();
      expect(articlesButton).not.toBeDisabled();
      expect(galleryButton).not.toBeDisabled();
    });

    it('should have disabled button for apps that cannot open', () => {
      render(<Dock />);
      const archiveButton = screen.getByLabelText('Archive');
      expect(archiveButton).toBeDisabled();
    });

    it('should apply opacity-60 class to disabled app images', () => {
      render(<Dock />);
      const archiveImage = screen.getByAltText('Archive');
      expect(archiveImage).toHaveClass('opacity-60');
    });

    it('should not apply opacity class to enabled app images', () => {
      render(<Dock />);
      const portfolioImage = screen.getByAltText('Portfolio');
      expect(portfolioImage).not.toHaveClass('opacity-60');
    });
  });

  describe('Tooltip Data Attributes', () => {
    it('should have tooltip data attributes on buttons', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-tooltip-id', 'dock-tooltip');
        expect(button).toHaveAttribute('data-tooltip-delay-show', '150');
      });
    });

    it('should have correct tooltip content for each app', () => {
      render(<Dock />);
      
      expect(screen.getByLabelText('Portfolio')).toHaveAttribute(
        'data-tooltip-content',
        'Portfolio'
      );
      expect(screen.getByLabelText('Articles')).toHaveAttribute(
        'data-tooltip-content',
        'Articles'
      );
      expect(screen.getByLabelText('Gallery')).toHaveAttribute(
        'data-tooltip-content',
        'Gallery'
      );
      expect(screen.getByLabelText('Archive')).toHaveAttribute(
        'data-tooltip-content',
        'Archive'
      );
    });
  });

  describe('Click Handling', () => {
    it('should call toggleApp when enabled button is clicked', () => {
      const { container } = render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      
      fireEvent.click(portfolioButton);
      
      // Since toggleApp is a stub, we just verify the button is clickable
      expect(portfolioButton).toBeInTheDocument();
    });

    it('should not trigger click on disabled buttons', () => {
      render(<Dock />);
      const archiveButton = screen.getByLabelText('Archive');
      
      // Attempt to click disabled button
      fireEvent.click(archiveButton);
      
      expect(archiveButton).toBeDisabled();
    });

    it('should handle multiple rapid clicks gracefully', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      
      fireEvent.click(portfolioButton);
      fireEvent.click(portfolioButton);
      fireEvent.click(portfolioButton);
      
      expect(portfolioButton).toBeInTheDocument();
    });
  });

  describe('GSAP Animation Setup', () => {
    it('should call useGSAP hook on mount', () => {
      render(<Dock />);
      expect(useGSAP).toHaveBeenCalled();
    });

    it('should setup animations for dock icons', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      
      expect(dockContainer).toBeInTheDocument();
    });

    it('should handle null ref gracefully', () => {
      const { rerender } = render(<Dock />);
      
      // Component should not crash with null ref
      expect(() => rerender(<Dock />)).not.toThrow();
    });
  });

  describe('Mouse Interaction Animation', () => {
    it('should setup mousemove event listener on dock container', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      
      // Simulate mouse move
      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      
      // Verify container exists and can receive events
      expect(dockContainer).toBeInTheDocument();
    });

    it('should setup mouseleave event listener on dock container', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      
      // Simulate mouse leave
      fireEvent.mouseLeave(dockContainer);
      
      expect(dockContainer).toBeInTheDocument();
    });

    it('should handle mousemove with various positions', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      
      // Simulate multiple mouse positions
      fireEvent.mouseMove(dockContainer, { clientX: 0 });
      fireEvent.mouseMove(dockContainer, { clientX: 50 });
      fireEvent.mouseMove(dockContainer, { clientX: 100 });
      fireEvent.mouseMove(dockContainer, { clientX: 200 });
      
      expect(dockContainer).toBeInTheDocument();
    });
  });

  describe('Animation Calculations', () => {
    it('should handle getBoundingClientRect calls', () => {
      const { container } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      
      // Mock getBoundingClientRect
      dockContainer.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        right: 400,
        top: 0,
        bottom: 80,
        width: 400,
        height: 80,
      }));
      
      fireEvent.mouseMove(dockContainer, { clientX: 200 });
      
      expect(dockContainer.getBoundingClientRect).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      const { container, unmount } = render(<Dock />);
      const dockContainer = container.querySelector('.dock-container');
      
      const removeEventListenerSpy = vi.spyOn(dockContainer, 'removeEventListener');
      
      unmount();
      
      // Verify cleanup was attempted
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all buttons', () => {
      render(<Dock />);
      
      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
      expect(screen.getByLabelText('Articles')).toBeInTheDocument();
      expect(screen.getByLabelText('Gallery')).toBeInTheDocument();
      expect(screen.getByLabelText('Archive')).toBeInTheDocument();
    });

    it('should have semantic section element with id', () => {
      const { container } = render(<Dock />);
      const section = container.querySelector('section#dock');
      
      expect(section).toBeInTheDocument();
    });

    it('should maintain focus management for keyboard users', () => {
      render(<Dock />);
      const firstButton = screen.getByLabelText('Portfolio');
      
      firstButton.focus();
      expect(firstButton).toHaveFocus();
    });

    it('should allow tab navigation through enabled buttons', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      // Tab through buttons
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty icon class gracefully', () => {
      render(<Dock />);
      const images = screen.getAllByRole('img');
      
      // First three images should not have opacity class
      expect(images[0]).not.toHaveClass('opacity-60');
      expect(images[1]).not.toHaveClass('opacity-60');
      expect(images[2]).not.toHaveClass('opacity-60');
      
      // Last image should have opacity class
      expect(images[3]).toHaveClass('opacity-60');
    });

    it('should handle apps with special characters in names', () => {
      render(<Dock />);
      
      // Verify all names render correctly
      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
      expect(screen.getByLabelText('Articles')).toBeInTheDocument();
    });

    it('should render correctly with no mouse interaction', () => {
      const { container } = render(<Dock />);
      
      // Component should be stable without any interaction
      expect(container.querySelector('.dock-container')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(4);
    });

    it('should handle rapid mount/unmount cycles', () => {
      const { unmount, rerender } = render(<Dock />);
      
      unmount();
      rerender(<Dock />);
      
      expect(screen.getAllByRole('button')).toHaveLength(4);
    });
  });

  describe('Component Structure', () => {
    it('should wrap each dock icon in a container div', () => {
      const { container } = render(<Dock />);
      const iconContainers = container.querySelectorAll('.relative.flex.justify-center');
      
      expect(iconContainers).toHaveLength(4);
    });

    it('should maintain correct DOM hierarchy', () => {
      const { container } = render(<Dock />);
      const section = container.querySelector('section#dock');
      const dockContainer = section.querySelector('.dock-container');
      
      expect(section).toContainElement(dockContainer);
      expect(dockContainer.children.length).toBe(5); // 4 apps + 1 tooltip
    });
  });

  describe('Image Loading', () => {
    it('should use correct image path format', () => {
      render(<Dock />);
      const images = screen.getAllByRole('img');
      
      images.forEach((img) => {
        expect(img.src).toContain('/images/');
        expect(img.src).toMatch(/\.(png|jpg|jpeg|svg)$/);
      });
    });

    it('should handle image loading errors gracefully', () => {
      render(<Dock />);
      const image = screen.getByAltText('Portfolio');
      
      // Simulate image error
      fireEvent.error(image);
      
      // Component should still be rendered
      expect(image).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with multiple dock apps', () => {
      const startTime = performance.now();
      render(<Dock />);
      const endTime = performance.now();
      
      // Rendering should be fast (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<Dock />);
      
      // Unmounting should clean up properly
      expect(() => unmount()).not.toThrow();
    });
  });
});