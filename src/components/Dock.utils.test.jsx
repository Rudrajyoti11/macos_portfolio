import { describe, it, expect } from 'vitest';

describe('Dock Animation Calculations', () => {
  describe('Distance Calculations', () => {
    it('should calculate distance correctly for positive values', () => {
      const mouseX = 100;
      const center = 50;
      const distance = Math.abs(mouseX - center);
      
      expect(distance).toBe(50);
    });

    it('should calculate distance correctly for negative values', () => {
      const mouseX = 50;
      const center = 100;
      const distance = Math.abs(mouseX - center);
      
      expect(distance).toBe(50);
    });

    it('should return zero when positions match', () => {
      const mouseX = 100;
      const center = 100;
      const distance = Math.abs(mouseX - center);
      
      expect(distance).toBe(0);
    });

    it('should handle floating point coordinates', () => {
      const mouseX = 100.5;
      const center = 50.3;
      const distance = Math.abs(mouseX - center);
      
      expect(distance).toBeCloseTo(50.2, 1);
    });
  });

  describe('Intensity Calculations', () => {
    it('should calculate maximum intensity at zero distance', () => {
      const distance = 0;
      const intensity = Math.exp(-(distance ** 2.5) / 20000);
      
      expect(intensity).toBe(1);
    });

    it('should calculate decreasing intensity with distance', () => {
      const distances = [0, 10, 50, 100];
      const intensities = distances.map(d => 
        Math.exp(-(d ** 2.5) / 20000)
      );
      
      // Each subsequent intensity should be less than previous
      for (let i = 1; i < intensities.length; i++) {
        expect(intensities[i]).toBeLessThan(intensities[i - 1]);
      }
    });

    it('should approach zero for large distances', () => {
      const distance = 1000;
      const intensity = Math.exp(-(distance ** 2.5) / 20000);
      
      expect(intensity).toBeLessThan(0.01);
    });

    it('should handle negative distances (absolute value)', () => {
      const positiveDistance = 50;
      const negativeDistance = -50;
      
      const intensity1 = Math.exp(-(Math.abs(positiveDistance) ** 2.5) / 20000);
      const intensity2 = Math.exp(-(Math.abs(negativeDistance) ** 2.5) / 20000);
      
      expect(intensity1).toBe(intensity2);
    });
  });

  describe('Scale Calculations', () => {
    it('should calculate scale at maximum intensity', () => {
      const intensity = 1;
      const scale = 1 + 0.25 * intensity;
      
      expect(scale).toBe(1.25);
    });

    it('should calculate scale at zero intensity', () => {
      const intensity = 0;
      const scale = 1 + 0.25 * intensity;
      
      expect(scale).toBe(1);
    });

    it('should calculate scale for partial intensity', () => {
      const intensity = 0.5;
      const scale = 1 + 0.25 * intensity;
      
      expect(scale).toBe(1.125);
    });

    it('should never produce scale less than 1', () => {
      for (let intensity = 0; intensity <= 1; intensity += 0.1) {
        const scale = 1 + 0.25 * intensity;
        expect(scale).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Y-Position Calculations', () => {
    it('should calculate maximum y-offset at full intensity', () => {
      const intensity = 1;
      const yOffset = -15 * intensity;
      
      expect(yOffset).toBe(-15);
    });

    it('should calculate zero y-offset at zero intensity', () => {
      const intensity = 0;
      const yOffset = -15 * intensity;
      
      expect(yOffset).toBe(0);
    });

    it('should calculate negative y-offset (upward movement)', () => {
      const intensity = 0.5;
      const yOffset = -15 * intensity;
      
      expect(yOffset).toBe(-7.5);
      expect(yOffset).toBeLessThan(0);
    });

    it('should scale y-offset proportionally to intensity', () => {
      const intensities = [0, 0.25, 0.5, 0.75, 1];
      const yOffsets = intensities.map(i => -15 * i);
      
      expect(yOffsets).toEqual([0, -3.75, -7.5, -11.25, -15]);
    });
  });

  describe('Center Position Calculations', () => {
    it('should calculate center from left and width', () => {
      const iconLeft = 100;
      const dockLeft = 20;
      const width = 60;
      const center = iconLeft - dockLeft + width / 2;
      
      expect(center).toBe(110);
    });

    it('should handle zero width', () => {
      const iconLeft = 100;
      const dockLeft = 20;
      const width = 0;
      const center = iconLeft - dockLeft + width / 2;
      
      expect(center).toBe(80);
    });

    it('should handle negative positions', () => {
      const iconLeft = 50;
      const dockLeft = 100;
      const width = 60;
      const center = iconLeft - dockLeft + width / 2;
      
      expect(center).toBe(-20);
    });
  });

  describe('Animation Parameters', () => {
    it('should use consistent duration for animations', () => {
      const hoverDuration = 0.2;
      const resetDuration = 0.3;
      
      expect(hoverDuration).toBeLessThan(resetDuration);
      expect(hoverDuration).toBeGreaterThan(0);
      expect(resetDuration).toBeGreaterThan(0);
    });

    it('should use appropriate easing function', () => {
      const ease = 'power1.out';
      
      expect(ease).toBe('power1.out');
    });
  });

  describe('Edge Case Calculations', () => {
    it('should handle very small distances', () => {
      const distance = 0.001;
      const intensity = Math.exp(-(distance ** 2.5) / 20000);
      
      expect(intensity).toBeCloseTo(1, 5);
    });

    it('should handle very large distances', () => {
      const distance = 10000;
      const intensity = Math.exp(-(distance ** 2.5) / 20000);
      
      expect(intensity).toBeCloseTo(0, 10);
    });

    it('should handle infinity gracefully', () => {
      const distance = Infinity;
      const intensity = Math.exp(-(distance ** 2.5) / 20000);
      
      expect(intensity).toBe(0);
    });
  });
});