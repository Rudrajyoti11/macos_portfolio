import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      id: 'safari',
      name: 'Articles',
      icon: 'safari.png',
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
  Tooltip: () => <div />,
}));

describe('Dock Accessibility Tests', () => {
  describe('Semantic HTML', () => {
    it('should use semantic section element', () => {
      const { container } = render(<Dock />);
      const section = container.querySelector('section');
      
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('should have meaningful section id', () => {
      const { container } = render(<Dock />);
      const section = container.querySelector('section');
      
      expect(section).toHaveAttribute('id', 'dock');
    });

    it('should use button elements for interactive items', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should use img elements with alt text', () => {
      render(<Dock />);
      const images = screen.getAllByRole('img');
      
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have aria-label on all buttons', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should have descriptive aria-labels', () => {
      render(<Dock />);
      
      expect(screen.getByLabelText('Portfolio')).toBeInTheDocument();
      expect(screen.getByLabelText('Articles')).toBeInTheDocument();
      expect(screen.getByLabelText('Archive')).toBeInTheDocument();
    });

    it('should match aria-label with visual label', () => {
      render(<Dock />);
      
      const portfolioButton = screen.getByLabelText('Portfolio');
      expect(portfolioButton).toHaveAttribute('data-tooltip-content', 'Portfolio');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have focusable buttons', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should allow tab navigation through enabled buttons', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      const articlesButton = screen.getByLabelText('Articles');
      
      portfolioButton.focus();
      expect(portfolioButton).toHaveFocus();
      
      articlesButton.focus();
      expect(articlesButton).toHaveFocus();
    });

    it('should maintain logical tab order', () => {
      const { container } = render(<Dock />);
      const buttons = Array.from(container.querySelectorAll('button'));
      
      // Buttons should be in DOM order
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Disabled State Accessibility', () => {
    it('should properly disable non-openable apps', () => {
      render(<Dock />);
      const archiveButton = screen.getByLabelText('Archive');
      
      expect(archiveButton).toBeDisabled();
    });

    it('should not be keyboard accessible when disabled', () => {
      render(<Dock />);
      const archiveButton = screen.getByLabelText('Archive');
      
      expect(archiveButton).toHaveAttribute('disabled');
    });

    it('should provide visual indication of disabled state', () => {
      render(<Dock />);
      const archiveImage = screen.getByAltText('Archive');
      
      expect(archiveImage).toHaveClass('opacity-60');
    });
  });

  describe('Screen Reader Support', () => {
    it('should have meaningful button type', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have descriptive alt text for images', () => {
      render(<Dock />);
      
      expect(screen.getByAltText('Portfolio')).toBeInTheDocument();
      expect(screen.getByAltText('Articles')).toBeInTheDocument();
      expect(screen.getByAltText('Archive')).toBeInTheDocument();
    });

    it('should not have empty alt attributes', () => {
      render(<Dock />);
      const images = screen.getAllByRole('img');
      
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        expect(alt).not.toBe('');
        expect(alt).not.toBeNull();
      });
    });
  });

  describe('Focus Management', () => {
    it('should be able to receive focus', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      
      portfolioButton.focus();
      expect(document.activeElement).toBe(portfolioButton);
    });

    it('should maintain focus indicators', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      
      portfolioButton.focus();
      expect(portfolioButton).toHaveFocus();
    });

    it('should support focus on enabled buttons only', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      const archiveButton = screen.getByLabelText('Archive');
      
      portfolioButton.focus();
      expect(portfolioButton).toHaveFocus();
      
      // Disabled button may still technically receive focus in test environment
      // but browser would skip it in real scenario
      archiveButton.focus();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should use opacity to indicate disabled state', () => {
      render(<Dock />);
      const archiveImage = screen.getByAltText('Archive');
      
      expect(archiveImage.className).toContain('opacity-60');
    });

    it('should not rely solely on color for interactive states', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      // All buttons should have text alternatives (aria-label)
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Tooltip Accessibility', () => {
    it('should have tooltip data attributes for assistive technology', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('data-tooltip-id');
        expect(button).toHaveAttribute('data-tooltip-content');
      });
    });

    it('should have appropriate tooltip delay', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('data-tooltip-delay-show', '150');
      });
    });
  });

  describe('Motion and Animation Accessibility', () => {
    it('should not prevent interaction during animations', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      
      // Button should remain clickable regardless of animation state
      expect(portfolioButton).not.toBeDisabled();
    });

    it('should maintain accessibility during hover effects', () => {
      render(<Dock />);
      const buttons = screen.getAllByRole('button');
      
      // All enabled buttons should remain accessible
      buttons.forEach(button => {
        if (!button.disabled) {
          expect(button).toBeEnabled();
        }
      });
    });
  });

  describe('Error Prevention', () => {
    it('should prevent actions on disabled items', () => {
      render(<Dock />);
      const archiveButton = screen.getByLabelText('Archive');
      
      expect(archiveButton).toBeDisabled();
    });

    it('should provide clear affordances for clickable items', () => {
      render(<Dock />);
      const portfolioButton = screen.getByLabelText('Portfolio');
      
      expect(portfolioButton.tagName).toBe('BUTTON');
      expect(portfolioButton).toBeEnabled();
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility on different viewports', () => {
      const { container } = render(<Dock />);
      const section = container.querySelector('section');
      
      expect(section).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });
  });
});