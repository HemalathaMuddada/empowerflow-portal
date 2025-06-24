import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders login page by default', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  // Assuming LoginPage has a distinct element, like a heading or button
  // For example, if LoginPage has an <h1> with "Login"
  const loginHeading = screen.getByRole('heading', { name: /Login/i });
  expect(loginHeading).toBeInTheDocument();
});
