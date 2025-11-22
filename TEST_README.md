# Testing Documentation for macOS Portfolio

## Overview

This project uses **Vitest** as the testing framework along with **@testing-library/react** for component testing. The testing setup is optimized for React 19 and Vite.

## Test Structure

### Test Files

- `src/components/Dock.test.jsx` - Comprehensive unit tests for the Dock component
- `src/components/Dock.integration.test.jsx` - Integration tests for animations and interactions
- `src/components/Dock.snapshot.test.jsx` - Snapshot and regression tests
- `src/components/Dock.utils.test.jsx` - Tests for pure calculation functions
- `src/components/Dock.accessibility.test.jsx` - Accessibility compliance tests
- `src/App.test.jsx` - Tests for the main App component
- `src/components/index.test.js` - Tests for component exports

### Test Categories

#### Unit Tests (`Dock.test.jsx`)
- Component rendering
- Props handling
- Event handlers
- DOM structure
- Tooltip integration
- Click handling
- ARIA attributes
- Edge cases

#### Integration Tests (`Dock.integration.test.jsx`)
- Mouse interaction workflows
- Animation state management
- Component lifecycle with animations
- Performance under load
- Tooltip integration with animations

#### Snapshot Tests (`Dock.snapshot.test.jsx`)
- DOM structure consistency
- Attribute stability
- Regression prevention
- Visual regression markers

#### Utility Tests (`Dock.utils.test.jsx`)
- Distance calculations
- Intensity calculations
- Scale calculations
- Y-position calculations
- Edge case mathematical operations

#### Accessibility Tests (`Dock.accessibility.test.jsx`)
- Semantic HTML usage
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast
- Disabled state handling

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Commands

- `npm test` - Run all tests once
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run test:coverage` - Generate coverage report

## Test Coverage

The test suite covers:

- ✅ Component rendering and structure
- ✅ User interactions (click, hover, keyboard)
- ✅ GSAP animation setup and cleanup
- ✅ Tooltip functionality
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ Edge cases and error handling
- ✅ Performance considerations
- ✅ Integration scenarios
- ✅ Mathematical calculations for animations

## Mocking Strategy

### GSAP Mocking

GSAP is mocked in `src/test/setup.js` to avoid animation execution during tests:

```javascript
vi.mock('gsap', () => ({
  default: {
    to: vi.fn(() => ({ kill: vi.fn() })),
    // ... other GSAP methods
  },
}));
```

### Constants Mocking

Test-specific mock data is provided in each test file:

```javascript
vi.mock('#constants', () => ({
  dockApps: [
    // Mock app data
  ],
}));
```

### Tooltip Mocking

React-tooltip is mocked to focus on component logic:

```javascript
vi.mock('react-tooltip', () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Automatic cleanup after each test via `@testing-library/react`
3. **Descriptive Names**: Test names clearly describe what is being tested
4. **Arrange-Act-Assert**: Tests follow the AAA pattern
5. **Mock External Dependencies**: GSAP, constants, and tooltips are mocked
6. **Accessibility First**: Comprehensive a11y tests ensure WCAG compliance

## Writing New Tests

When adding new components or features:

1. Create a test file with `.test.jsx` extension
2. Import necessary testing utilities
3. Mock external dependencies
4. Write descriptive test cases
5. Cover happy paths, edge cases, and error conditions
6. Include accessibility tests
7. Run tests and ensure they pass

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module"
**Solution**: Ensure all path aliases in `vitest.config.js` match your project structure

**Issue**: GSAP animations causing test failures
**Solution**: Verify GSAP is properly mocked in `src/test/setup.js`

**Issue**: Timeout errors
**Solution**: Increase test timeout in vitest config if needed

## Contributing

When contributing tests:

1. Follow existing test patterns
2. Maintain high test coverage
3. Include both unit and integration tests
4. Document complex test scenarios
5. Ensure tests are fast and reliable

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)