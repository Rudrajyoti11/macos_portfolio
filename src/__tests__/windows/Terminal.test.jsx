import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Terminal from '../../windows/Terminal.jsx';

vi.mock('#constants/index.js', () => ({
  techStack: [
    { category: 'Frontend', items: ['React.js', 'TypeScript'] },
    { category: 'Backend', items: ['Node.js', 'Express'] },
  ],
}));
vi.mock('#hoc/WindowWrapper.jsx', () => ({ default: (C) => C }));
vi.mock('#components', () => ({ WindowControlls: ({ target }) => <div>{target}</div> }));
vi.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  Flag: () => <div data-testid="flag-icon" />,
}));

describe('Terminal', () => {
  it('renders terminal window', () => {
    render(<Terminal />);
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
  });

  it('displays all tech categories', () => {
    render(<Terminal />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('displays tech items', () => {
    render(<Terminal />);
    expect(screen.getByText(/React\.js/)).toBeInTheDocument();
    expect(screen.getByText(/Node\.js/)).toBeInTheDocument();
  });

  it('shows success message', () => {
    render(<Terminal />);
    expect(screen.getByText(/5 of 5 stacks loaded successfully/)).toBeInTheDocument();
  });

  it('renders icons', () => {
    render(<Terminal />);
    expect(screen.getAllByTestId('check-icon').length).toBeGreaterThan(0);
    expect(screen.getByTestId('flag-icon')).toBeInTheDocument();
  });
});