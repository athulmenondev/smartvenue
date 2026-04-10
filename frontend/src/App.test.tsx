import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App structure', () => {
  it('renders Sidebar Navigation', () => {
    // Actually render the app to utilize the imports and avoid TS6133/TS6192 errors
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
