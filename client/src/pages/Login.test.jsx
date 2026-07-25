import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from './Login';

const renderLogin = (login) =>
  render(
    <AuthContext.Provider value={{ login, isAuthenticated: false }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('Login page', () => {
  it('submits the entered credentials to login()', async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue({ success: true });
    renderLogin(login);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'password123',
      });
    });
  });

  it('shows an error message when login fails', async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue({ success: false, error: 'Invalid credentials' });
    renderLogin(login);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('requires email and password before submitting', async () => {
    const login = vi.fn();
    renderLogin(login);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toBeRequired();
    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toBeRequired();
  });
});
