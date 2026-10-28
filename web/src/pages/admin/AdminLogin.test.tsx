import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminLogin from './AdminLogin';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ admin: null, login: vi.fn() }),
}));

afterEach(() => vi.useRealTimers());

describe('AdminLogin', () => {
  it('rodapé mostra o ano corrente, não um ano fixo', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2031-03-01T12:00:00Z'));
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>,
    );
    expect(screen.getByText(/© 2031 Scriptorium Divinum/)).toBeInTheDocument();
  });
});
