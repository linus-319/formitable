import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

function Example() {
  return <h1>Hello, testing!</h1>;
}

describe('Example', () => {
  it('renders correctly', () => {
    render(<Example />);

    expect(
      screen.getByRole('heading', { name: 'Hello, testing!' })
    ).toBeInTheDocument();
  });
});