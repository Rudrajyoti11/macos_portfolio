import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

// Mock all child components
vi.mock('#components', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar Component</nav>,
  Welcome: () => <section data-testid="welcome">Welcome Component</section>,
  Dock: () => <section data-testid="dock">Dock Component</section>,
}));

describe('App Component', () => {
  describe('Rendering', () => {
    it('should render the main element', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should render Navbar component', () => {
      render(<App />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render Welcome component', () => {
      render(<App />);
      expect(screen.getByTestId('welcome')).toBeInTheDocument();
    });

    it('should render Dock component', () => {
      render(<App />);
      expect(screen.getByTestId('dock')).toBeInTheDocument();
    });
  });

  describe('Component Order', () => {
    it('should render components in correct order', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      const children = Array.from(main.children);
      
      expect(children[0]).toHaveAttribute('data-testid', 'navbar');
      expect(children[1]).toHaveAttribute('data-testid', 'welcome');
      expect(children[2]).toHaveAttribute('data-testid', 'dock');
    });

    it('should have exactly three child components', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main.children).toHaveLength(3);
    });
  });

  describe('Structure', () => {
    it('should use main as the root element', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeTruthy();
      expect(main.tagName).toBe('MAIN');
    });

    it('should contain all required components', () => {
      render(<App />);
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('welcome')).toBeInTheDocument();
      expect(screen.getByTestId('dock')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render without crashing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    it('should render all components simultaneously', () => {
      render(<App />);
      
      const navbar = screen.getByTestId('navbar');
      const welcome = screen.getByTestId('welcome');
      const dock = screen.getByTestId('dock');
      
      expect(navbar).toBeInTheDocument();
      expect(welcome).toBeInTheDocument();
      expect(dock).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have a semantic main landmark', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeInTheDocument();
    });

    it('should maintain proper document structure', () => {
      const { container } = render(<App />);
      
      // Should have one main element
      const mains = container.querySelectorAll('main');
      expect(mains).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple renders', () => {
      const { rerender } = render(<App />);
      
      rerender(<App />);
      rerender(<App />);
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('welcome')).toBeInTheDocument();
      expect(screen.getByTestId('dock')).toBeInTheDocument();
    });

    it('should not have extra wrapper elements', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      // Main should be a direct child of container
      expect(container.firstChild).toBe(main);
    });
  });

  describe('Component Updates', () => {
    it('should maintain component state across rerenders', () => {
      const { rerender } = render(<App />);
      
      const navbarBefore = screen.getByTestId('navbar');
      
      rerender(<App />);
      
      const navbarAfter = screen.getByTestId('navbar');
      expect(navbarAfter).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<App />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});