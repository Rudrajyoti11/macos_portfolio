import { describe, it, expect } from 'vitest';
import { Navbar, Welcome, Dock } from './index.js';

describe('Components Index Exports', () => {
  describe('Export Validation', () => {
    it('should export Navbar component', () => {
      expect(Navbar).toBeDefined();
      expect(typeof Navbar).toBe('function');
    });

    it('should export Welcome component', () => {
      expect(Welcome).toBeDefined();
      expect(typeof Welcome).toBe('function');
    });

    it('should export Dock component', () => {
      expect(Dock).toBeDefined();
      expect(typeof Dock).toBe('function');
    });
  });

  describe('Export Types', () => {
    it('should export Navbar as a React component', () => {
      expect(Navbar).toBeInstanceOf(Function);
      expect(Navbar.name).toBe('Navbar');
    });

    it('should export Welcome as a React component', () => {
      expect(Welcome).toBeInstanceOf(Function);
      expect(Welcome.name).toBe('Welcome');
    });

    it('should export Dock as a React component', () => {
      expect(Dock).toBeInstanceOf(Function);
      expect(Dock.name).toBe('default');
    });
  });

  describe('Named Exports', () => {
    it('should have exactly three named exports', async () => {
      const exports = await import('./index.js');
      const namedExports = Object.keys(exports);
      
      expect(namedExports).toContain('Navbar');
      expect(namedExports).toContain('Welcome');
      expect(namedExports).toContain('Dock');
      expect(namedExports).toHaveLength(3);
    });

    it('should not have default export', async () => {
      const module = await import('./index.js');
      expect(module.default).toBeUndefined();
    });
  });

  describe('Component Consistency', () => {
    it('should export components that can be imported separately', async () => {
      const { Navbar: Nav, Welcome: Wel, Dock: Dck } = await import('./index.js');
      
      expect(Nav).toBeDefined();
      expect(Wel).toBeDefined();
      expect(Dck).toBeDefined();
    });

    it('should maintain component references', () => {
      const imports1 = { Navbar, Welcome, Dock };
      const imports2 = { Navbar, Welcome, Dock };
      
      expect(imports1.Navbar).toBe(imports2.Navbar);
      expect(imports1.Welcome).toBe(imports2.Welcome);
      expect(imports1.Dock).toBe(imports2.Dock);
    });
  });

  describe('Import Patterns', () => {
    it('should support destructured imports', async () => {
      const { Navbar, Welcome, Dock } = await import('./index.js');
      
      expect(Navbar).toBeDefined();
      expect(Welcome).toBeDefined();
      expect(Dock).toBeDefined();
    });

    it('should support wildcard imports', async () => {
      const components = await import('./index.js');
      
      expect(components.Navbar).toBeDefined();
      expect(components.Welcome).toBeDefined();
      expect(components.Dock).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should export only React components', () => {
      expect(typeof Navbar).toBe('function');
      expect(typeof Welcome).toBe('function');
      expect(typeof Dock).toBe('function');
    });

    it('should not export any non-component values', async () => {
      const exports = await import('./index.js');
      const values = Object.values(exports);
      
      values.forEach(value => {
        expect(typeof value).toBe('function');
      });
    });
  });
});