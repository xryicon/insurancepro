import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('renders spinner when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
